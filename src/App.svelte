<script>
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
  let calendarMonth = today.getMonth();
  let calendarYear = today.getFullYear();
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

  function selectDay(day) {
    selectedDay = day;
  }
  // User info and PRs
  let userName = "Eli";
  let benchPR = 0;
  let squatPR = 0;
  let deadliftPR = 0;

  const exerciseOptions = {
    Push: ["Bench Press", "Shoulder Press", "Lateral Raises", "Triceps Extension", "Dips"],
    Pull: ["Deadlift", "Barbell Row", "Bicep Curl", "Lat Pulldown", "Face Pull"],
    Legs: ["Squat", "Deadlift", "Leg Press", "Hamstring Curl", "Quad Extension"]
  };

  // Array of day objects for each entry
  let days = [
    {
      date: new Date("2025-09-05"),
      image: null,
      imageCaption: "",
      liftDone: true,
      exerciseGroup: "Push",
      liftWeight: 185,
      exercise: "Bench Press",
      saveMessage: ""
    },
    {
      date: new Date("2025-09-06"),
      image: null,
      imageCaption: "",
      liftDone: false,
      exerciseGroup: "Legs",
      liftWeight: 0,
      exercise: "Squat",
      saveMessage: ""
    },
    {
      date: new Date(), // today
      image: null,
      imageCaption: "",
      liftDone: false,
      exerciseGroup: "",
      liftWeight: 0,
      exercise: "Bench Press",
      saveMessage: ""
    }
  ];

  // Use the last day (today) for the UI
  let day = days[days.length - 1];

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      day.image = URL.createObjectURL(file);
    }
  }

  $: lastEntry = days.length > 1 ? days[days.length - 2] : null;

  function handleSubmit() {
    // Update PRs if new liftWeight is greater than current PR
    if (day.exercise === "Bench Press" && day.liftWeight > benchPR) {
      benchPR = day.liftWeight;
    }
    if (day.exercise === "Squat" && day.liftWeight > squatPR) {
      squatPR = day.liftWeight;
    }
    if (day.exercise === "Deadlift" && day.liftWeight > deadliftPR) {
      deadliftPR = day.liftWeight;
    }
    day.saveMessage = "Entry saved!";
    // Add new entry to days array
    days = [...days, {
      date: new Date(),
      image: day.image,
      imageCaption: day.imageCaption,
      liftDone: day.liftDone,
      exerciseGroup: day.exerciseGroup,
      liftWeight: day.liftWeight,
      exercise: day.exercise,
      saveMessage: ""
    }];
    day = days[days.length - 1];
    setTimeout(() => day.saveMessage = "", 2000);
  }
</script>

<main>
<!-- Calendar UI -->
<div class="calendar">
  <div class="calendar-header">
    <strong>{today.toLocaleString('default', { month: 'long' })} {calendarYear}</strong>
  </div>
  <div class="calendar-grid">
    {#each calendarDays as day}
      <div
        class="calendar-day {selectedDay.toDateString() === day.toDateString() ? 'selected' : ''}"
        on:click={() => selectDay(day)}
      >
        <span>{day.getDate()}</span>
        {#if findEntry(day)}
          <svg width="16" height="16">
            <circle
              cx="8"
              cy="8"
              r="7"
              fill={findEntry(day).liftDone ? "#27ae60" : "#e74c3c"}
              stroke="#fff"
              stroke-width="2"
            />
          </svg>
        {/if}
      </div>
    {/each}
  </div>
  <div class="calendar-details">
    {#if selectedEntry}
      <div>
        <strong>{selectedDay.toLocaleDateString()}</strong><br>
        <strong>Lifted:</strong> {selectedEntry.liftDone ? "Yes" : "No"}<br>
        <strong>Group:</strong> {selectedEntry.exerciseGroup}<br>
        <strong>Exercise:</strong> {selectedEntry.exercise}<br>
        <strong>Weight:</strong> {selectedEntry.liftWeight} lbs
      </div>
    {:else}
      <div>
        <strong>{selectedDay.toLocaleDateString()}</strong><br>
        No entry for this day.
      </div>
    {/if}
  </div>
</div>
  <div class="grid-container">
    <!-- Top left: Greeting -->
    <div class="grid-greeting">
      <h1>Hi, <span>{userName}</span>!</h1>
      <p class="date-time">{day.date.toLocaleDateString()}<br>{day.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    </div>

    <!-- Top right: SVG PR display -->
    <div class="grid-pr-display">
      <h2>Max PRs</h2>
      <div class="pr-svg-row">
        <div class="pr-svg">
          <svg width="60" height="60">
            <circle cx="30" cy="30" r="28" fill="#e74c3c" stroke="#fff" stroke-width="2" />
            <text x="30" y="36" text-anchor="middle" fill="#fff" font-size="18">{benchPR || 0}</text>
          </svg>
          <div>Bench</div>
        </div>
        <div class="pr-svg">
          <svg width="60" height="60">
            <circle cx="30" cy="30" r="28" fill="#3498db" stroke="#fff" stroke-width="2" />
            <text x="30" y="36" text-anchor="middle" fill="#fff" font-size="18">{squatPR || 0}</text>
          </svg>
          <div>Squat</div>
        </div>
        <div class="pr-svg">
          <svg width="60" height="60">
            <circle cx="30" cy="30" r="28" fill="#27ae60" stroke="#fff" stroke-width="2" />
            <text x="30" y="36" text-anchor="middle" fill="#fff" font-size="18">{deadliftPR || 0}</text>
          </svg>
          <div>Deadlift</div>
        </div>
      </div>
      <!-- Last entry summary -->
      <div class="last-entry-summary">
        <h3>Last Entry</h3>
        {#if lastEntry}
          <div>
            <strong>Date:</strong> {lastEntry.date.toLocaleDateString()}<br>
            <strong>Lifted:</strong> {lastEntry.liftDone ? "Yes" : "No"}<br>
            <strong>Group:</strong> {lastEntry.exerciseGroup}<br>
            <strong>Exercise:</strong> {lastEntry.exercise}<br>
            <strong>Weight:</strong> {lastEntry.liftWeight} lbs
          </div>     
        {:else}
          <div>No previous entry.</div>
        {/if}
      </div>
    </div>

    <!-- Bottom left: Lift input, exercise group, weight input -->
    <div class="grid-lift-input">
      <form class="lift-form" on:submit|preventDefault={handleSubmit}>
        <label>
          Did you lift today?
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
        <button type="submit">Save Entry</button>
        {#if day.saveMessage}
          <div class="save-message">{day.saveMessage}</div>
        {/if}
      </form>
    </div>
  </div>
</main>

<style>
.calendar {
  margin-bottom: 2rem;
  background: #fafafa;
  border-radius: 8px;
  padding: 1rem;
  max-width: 350px;
}
.calendar-header {
  text-align: center;
  margin-bottom: 0.5rem;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.calendar-day {
  background: #fff;
  border-radius: 4px;
  padding: 4px 0;
  text-align: center;
  cursor: pointer;
  position: relative;
  min-height: 32px;
  border: 1px solid #eee;
}
.calendar-day.selected {
  border: 2px solid #3498db;
}
.calendar-day svg {
  display: block;
  margin: 0 auto;
}
.calendar-details {
  margin-top: 1rem;
  font-size: 0.95em;
  background: #f0f8ff;
  border-radius: 4px;
  padding: 0.5rem;
}
</style>