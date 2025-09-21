<script>
  import PRGraphs from './sites/pr-graphs.svelte';
  
  // Router logic
  let currentPage = 'home';
  
  function handleNavigation() {
    const hash = window.location.hash.slice(1) || 'home';
    currentPage = hash;
  }
  
  // Listen for hash changes
  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', handleNavigation);
    handleNavigation(); // Set initial page
  }

  // User info and PRs
  let userName = "Eli";
  let startDate = new Date("2025-09-01");

  let benchPR = 225;
  let squatPR = 265;
  let deadliftPR = 315;

  let goalBench = 275;
  let goalSquat = 315;
  let goalDeadlift = 365;
  let showGoalEditor = false;

  function toggleGoalEditor() {
    showGoalEditor = !showGoalEditor;
  }

  function saveGoals() {
    showGoalEditor = false;
    // You could save these to localStorage or a database here
  }

  // Calculate progress towards goals
  $: benchProgress = benchPR && goalBench ? Math.min((benchPR / goalBench) * 100, 100) : 0;
  $: squatProgress = squatPR && goalSquat ? Math.min((squatPR / goalSquat) * 100, 100) : 0;
  $: deadliftProgress = deadliftPR && goalDeadlift ? Math.min((deadliftPR / goalDeadlift) * 100, 100) : 0;

  const exerciseOptions = {
    Push: ["Bench Press", "Shoulder Press", "Lateral Raises", "Triceps Extension", "Dips"],
    Pull: ["Deadlift", "Barbell Row", "Bicep Curl", "Lat Pulldown", "Face Pull"],
    Legs: ["Squat", "Deadlift", "Leg Press", "Hamstring Curl", "Quad Extension"]
  };

  // Array of day objects for each entry
  let days = [
    {
      date: new Date("2025-09-05"),
      liftDone: true,
      exerciseGroup: "Push",
      liftWeight: 225,
      exercise: "Bench Press",
      calories: 2000
    },
    {
      date: new Date("2025-09-12"),
      liftDone: true,
      exerciseGroup: "Push",
      liftWeight: 235,
      exercise: "Bench Press",
      calories: 2000
    },
    {
      date: new Date("2025-09-06"),
      liftDone: true,
      exerciseGroup: "Pull",
      liftWeight: 315,
      exercise: "Deadlift",
      calories: 2000
    },
    {
      date: new Date("2025-09-13"),
      liftDone: true,
      exerciseGroup: "Pull",
      liftWeight: 325,
      exercise: "Deadlift",
      calories: 2000
    },
    {
      date: new Date("2025-09-07"),
      liftDone: true,
      exerciseGroup: "Legs",
      liftWeight: 265,
      exercise: "Squat",
      calories: 2000
    },
    {
      date: new Date("2025-09-14"),
      liftDone: true,
      exerciseGroup: "Legs",
      liftWeight: 225,
      exercise: "Squat",
      calories: 2000
    },
    {
      date: new Date(), // today
      liftDone: false,
      exerciseGroup: "",
      liftWeight: 0,
      exercise: "",
      calories: 0
    }
  ];

  let isDarkMode = true;
  function toggleDarkMode() {
    isDarkMode = !isDarkMode;
  }

  let isSimpleMode = false;
  function toggleSimpleMode() {
    isSimpleMode = !isSimpleMode;
  }

  // Use the last day (today) for the UI
  let day = days[days.length - 1];

  // get the amount of days since start date
  function getDaysSinceStart() {
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  let daysTracked = days.filter(d => d.liftDone).length;

  // get the amount of days tracked
  function updateDaysTracked() {
    daysTracked = days.filter(d => d.liftDone).length;
  }

  $: lastEntry = days.length > 1 ? days[days.length - 2] : null;

  function selectDay(calendarDay) {
    selectedDay = calendarDay;
    
    // Load the selected day's data into the form for editing
    const dayEntry = findEntry(calendarDay);
    if (dayEntry) {
      // If there's an entry for this day, load it into the form
      day = {
        date: new Date(calendarDay),
        liftDone: dayEntry.liftDone,
        exerciseGroup: dayEntry.exerciseGroup,
        liftWeight: dayEntry.liftWeight,
        exercise: dayEntry.exercise,
        calories: dayEntry.calories
      };
    } else {
      // If no entry exists, create a new entry for this day
      day = {
        date: new Date(calendarDay),
        liftDone: false,
        exerciseGroup: "",
        liftWeight: 0,
        exercise: "",
        calories: 0
      };
    }
  }

  function calculateMaxPRs() {
    benchPR = Math.max(...days.filter(d => d.exercise === "Bench Press").map(d => d.liftWeight), 0);
    squatPR = Math.max(...days.filter(d => d.exercise === "Squat").map(d => d.liftWeight), 0);
    deadliftPR = Math.max(...days.filter(d => d.exercise === "Deadlift").map(d => d.liftWeight), 0);
  }

  function goToPreviousMonth() {
    if (calendarMonth === 0) {
      calendarMonth = 11;
      calendarYear -= 1;
    } else {
      calendarMonth -= 1;
    }
    calendarDays = getDaysInMonth(calendarYear, calendarMonth);
  }

  function goToNextMonth() {
    if (calendarMonth === 11) {
      calendarMonth = 0;
      calendarYear += 1;
    } else {
      calendarMonth += 1;
    }
    calendarDays = getDaysInMonth(calendarYear, calendarMonth);
  }

  function goToCurrentMonth() {
    const today = new Date();
    calendarMonth = today.getMonth();
    calendarYear = today.getFullYear();
    calendarDays = getDaysInMonth(calendarYear, calendarMonth);
  }

  function handleSubmit() {
    // Update PRs if new liftWeight is greater than current PR
    calculateMaxPRs();
    
    // Save the current day's data to the days array
    const currentDayIndex = days.findIndex(d => 
      d.date.getFullYear() === day.date.getFullYear() &&
      d.date.getMonth() === day.date.getMonth() &&
      d.date.getDate() === day.date.getDate()
    );
    
    if (currentDayIndex >= 0) {
      // Update existing entry
      days[currentDayIndex] = { ...day };
    } else {
      // Add new entry
      days = [...days, { ...day }];
    }
    
    // Force calendar to update by triggering reactivity
    days = days;
    
    // Update selected day to current day to show the new entry in calendar details
    selectedDay = new Date(day.date);
    
    day.saveMessage = "Entry saved!";
    setTimeout(() => day.saveMessage = "", 2000);
    updateDaysTracked();
    getDaysSinceStart();
  }

  // Calendar logic
  function getDaysInMonth(year, month) {
    const date = new Date(year, month, 1);
    const daysArr = [];
    while (date.getMonth() === month) {
      daysArr.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return daysArr;
  }

  let today = new Date();
  $: calendarMonth = day.date.getMonth();
  $: calendarYear = day.date.getFullYear();
  $: calendarDays = getDaysInMonth(calendarYear, calendarMonth);

  function findEntry(date) {
    return days.find(
      d =>
        d.date.getFullYear() === date.getFullYear() &&
        d.date.getMonth() === date.getMonth() &&
        d.date.getDate() === date.getDate()
    );
  }

  let selectedDay = today;
  $: selectedEntry = findEntry(selectedDay);
  
  // Force calendar to re-render when days array changes
  $: if (days) {
    // This reactive statement ensures the calendar updates when days changes
    calendarDays = getDaysInMonth(calendarYear, calendarMonth);
  }
  calculateMaxPRs();
</script>

<main class:dark-mode={isDarkMode} class:light-mode={!isDarkMode}>
  {#if currentPage === 'pr-graphs'}
    <PRGraphs {days} {userName} {benchPR} {squatPR} {deadliftPR} {isDarkMode} {goalBench} {goalSquat} {goalDeadlift}/>
  {:else}
    <div class="grid-container">
    <!-- Top left: Greeting -->
    <div class="grid-greeting">
      <h1>Hi, <span>{userName}</span>!</h1>
      <p class="date-time">{new Date().toLocaleDateString()}</p>
      <p class="days-since">{getDaysSinceStart()} days since starting</p>
      <p class="days-tracked">{daysTracked} days tracked</p>
      <div class="settings-panel">
        <button class="settings-btn" on:click={toggleDarkMode}>
          {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Light' : 'Dark'} Mode
        </button>
        <button class="settings-btn" on:click={toggleSimpleMode}>
          {isSimpleMode ? '📊' : '📝'} {isSimpleMode ? 'Detailed' : 'Simple'} View
        </button>
        <button class="settings-btn" on:click={toggleGoalEditor}>
          🎯 {showGoalEditor ? 'Close' : 'Set Goals'}
        </button>
      </div>
    </div>

    <!-- Top right: SVG PR display -->
    <div class="grid-pr-display">
      {#if showGoalEditor}
        <!-- ADD THIS GOAL EDITOR SECTION -->
        <div class="goal-editor">
          <h2>Set Your PR Goals</h2>
          <div class="goal-inputs">
            <label>
              Bench Press Goal (lbs): 
              <input type="number" bind:value={goalBench} min="0" max="1000">
              <br/>
            </label>
            <label>
              Squat Goal (lbs):
              <input type="number" bind:value={goalSquat} min="0" max="1000">
              <br/>
            </label>
            <label>
              Deadlift Goal (lbs):
              <input type="number" bind:value={goalDeadlift} min="0" max="1000">
              <br/>
            </label>
          </div>
          <div class="goal-actions">
            <button class="save-goals-btn" on:click={saveGoals}>Save Goals</button>
            <button class="cancel-goals-btn" on:click={toggleGoalEditor}>Cancel</button>
          </div>
        </div>
      {:else}
      <a href="#pr-graphs" class="pr-svg-links">
        <h2>Max PRs</h2>
        <div class="pr-svg-row">
          <div class="pr-svg-bench">
              <div class="pr-circle-container">
                <svg width="80" height="80">
                  <!-- Background circle -->
                  <circle cx="40" cy="40" r="35" fill="none" stroke="#444" stroke-width="4" />
                  <!-- Progress circle -->
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="35" 
                    fill="none" 
                    stroke="#e74c3c" 
                    stroke-width="4"
                    stroke-dasharray={`${2 * Math.PI * 35}`}
                    stroke-dashoffset={`${2 * Math.PI * 35 * (1 - benchProgress / 100)}`}
                    transform="rotate(-90 40 40)"
                    class="progress-circle"
                  />
                  <!-- Inner circle with PR -->
                  <circle cx="40" cy="40" r="28" fill="#e74c3c" stroke="#fff" stroke-width="2" />
                  <text x="40" y="46" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">{benchPR || 0}</text>
                </svg>
              </div>
              <div class="pr-info">
                <strong>Bench</strong>
                <span class="goal-text">Goal: {goalBench}</span>
              </div>
            </div>
          <div class="pr-svg-squat">
              <div class="pr-circle-container">
                <svg width="80" height="80">
                  <!-- Background circle -->
                  <circle cx="40" cy="40" r="35" fill="none" stroke="#444" stroke-width="4" />
                  <!-- Progress circle -->
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="35" 
                    fill="none" 
                    stroke="#3498db" 
                    stroke-width="4"
                    stroke-dasharray={`${2 * Math.PI * 35}`}
                    stroke-dashoffset={`${2 * Math.PI * 35 * (1 - squatProgress / 100)}`}
                    transform="rotate(-90 40 40)"
                    class="progress-circle"
                  />
                  <!-- Inner circle with PR -->
                  <circle cx="40" cy="40" r="28" fill="#3498db" stroke="#fff" stroke-width="2" />
                  <text x="40" y="46" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">{squatPR || 0}</text>
                </svg>
              </div>
              <div class="pr-info">
                <strong>Squat</strong>
                <span class="goal-text">Goal: {goalSquat}</span>
              </div>
            </div>
            <div class="pr-svg-deadlift">
              <div class="pr-circle-container">
                <svg width="80" height="80">
                  <!-- Background circle -->
                  <circle cx="40" cy="40" r="35" fill="none" stroke="#444" stroke-width="4" />
                  <!-- Progress circle -->
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="35" 
                    fill="none" 
                    stroke="#27ae60" 
                    stroke-width="4"
                    stroke-dasharray={`${2 * Math.PI * 35}`}
                    stroke-dashoffset={`${2 * Math.PI * 35 * (1 - deadliftProgress / 100)}`}
                    transform="rotate(-90 40 40)"
                    class="progress-circle"
                  />
                  <!-- Inner circle with PR -->
                  <circle cx="40" cy="40" r="28" fill="#27ae60" stroke="#fff" stroke-width="2" />
                  <text x="40" y="46" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">{deadliftPR || 0}</text>
                </svg>
              </div>
              <div class="pr-info">
                <strong>Deadlift</strong>
                <span class="goal-text">Goal: {goalDeadlift}</span>
              </div>
            </div>
        </div>
      </a>

      <!-- Calendar UI -->
      <div class="calendar">
          <div class="calendar-header">
            <button class="nav-button" on:click={goToPreviousMonth} title="Previous month">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15,18 9,12 15,6"></polyline>
              </svg>
            </button>
            
            <h2 class="month-title" on:click={goToCurrentMonth} title="Go to current month">
              {new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long' })} {calendarYear}
            </h2>
            
            <button class="nav-button" on:click={goToNextMonth} title="Next month">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9,6 15,12 9,18"></polyline>
              </svg>
            </button>
          </div>

          <div class="calendar-grid">
            {#each calendarDays as calendarDay}
              {@const dayEntry = findEntry(calendarDay)}
              <div
                class="calendar-day {selectedDay.toDateString() === calendarDay.toDateString() ? 'selected' : ''}"
                on:click={() => selectDay(calendarDay)}
                role="button"
                tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && selectDay(calendarDay)}
              >
                <span>{calendarDay.getDate()}</span>
                {#if dayEntry}
                  <svg width="16" height="16">
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      fill={dayEntry.liftDone ? "#27ae60" : "#e74c3c"}
                      stroke="#fff"
                      stroke-width="2"
                    />
                  </svg>
                {/if}
              </div>
            {/each}
          </div>
        <div class="calendar-details">
          {#if !isSimpleMode}
            {#if selectedEntry}
              <div>
                <strong>{selectedDay.toLocaleDateString()}</strong><br>
                <strong>Lifted:</strong> {selectedEntry.liftDone ? "Yes" : "No"}<br>
                <strong>Group:</strong> {selectedEntry.exerciseGroup}<br>
                <strong>Exercise:</strong> {selectedEntry.exercise}<br>
                <strong>Weight:</strong> {selectedEntry.liftWeight} lbs<br>
                <strong>Calories:</strong> {selectedEntry.calories} kcal
              </div>
            {:else}
              <div>
                <strong>{selectedDay.toLocaleDateString()}</strong><br>
                No entry for this day.
              </div>
            {/if}
          {:else}
            {#if selectedEntry}
              <div>
                <strong>{selectedDay.toLocaleDateString()}</strong><br>
                <strong>Lifted:</strong> {selectedEntry.liftDone ? "Yes" : "No"}
              </div>
            {:else}
              <div>
                <strong>{selectedDay.toLocaleDateString()}</strong><br>
                No entry for this day.
              </div>
            {/if}
          {/if}
        </div>
      </div>
      {/if}
    </div>

    <!-- Bottom left: Lift input, exercise group, weight input -->
    <div class="grid-lift-input">
      {#if !isSimpleMode}
        <form class="lift-form" on:submit|preventDefault={handleSubmit}>
          <div class="form-header">
            <h3>
              {day.date.toDateString() === new Date().toDateString() 
                ? "Today's Workout" 
                : `Edit ${day.date.toLocaleDateString()}`}
            </h3>
            </div>
            <label>
              Did you lift?
              <input type="checkbox" bind:checked={day.liftDone}>
            </label>
            <label>
              Exercise group:
              <select bind:value={day.exerciseGroup}>
                <option value="">Select</option>
                <option value="Push">Push</option>
                <option value="Pull">Pull</option>
                <option value="Legs">Legs</option>
              </select>
            </label>
            <label>
              Exercise:
              <select bind:value={day.exercise}>
                <option value="" disabled selected>Select exercise</option>
                {#if day.exerciseGroup}
                  {#each exerciseOptions[day.exerciseGroup] as ex}
                    <option value={ex}>{ex}</option>
                  {/each}
                {/if}
              </select>
            </label>
            <label>
              Weight (lbs):
              <input type="number" min="0" max="1000" placeholder="Weight" bind:value={day.liftWeight}>
            </label>
            <label>
              Calories (kcal):
              <input type="number" min="0" max="10000" placeholder="Calories" bind:value={day.calories}>
            </label>
            <button type="submit">
              {day.date.toDateString() === new Date().toDateString() ? "Save Entry" : "Update Entry"}
            </button>
            {#if day.saveMessage}
              <div class="save-message">{day.saveMessage}</div>
            {/if}
        </form>
      {:else}
        <form class="lift-form" on:submit|preventDefault={handleSubmit}>
          <div class="form-header">
            <h3>
              {day.date.toDateString() === new Date().toDateString() 
                ? "Today's Workout" 
                : `Edit ${day.date.toLocaleDateString()}`}
            </h3>
            <label>
                Did you lift?
                <input type="checkbox" bind:checked={day.liftDone}>
            </label>
            <button type="submit">
              {day.date.toDateString() === new Date().toDateString() ? "Save Entry" : "Update Entry"}
            </button>
            {#if day.saveMessage}
              <div class="save-message">{day.saveMessage}</div>
            {/if}
          </div>
        </form>
      {/if}
    </div>
  </div>
  {/if}
</main>