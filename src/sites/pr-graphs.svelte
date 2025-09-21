<script>
  // Import the data from your main app - you'll need to pass this as props or use a store
  export let days = [];
  export let userName = "Eli";
  export let benchPR = 225;
  export let squatPR = 265;
  export let deadliftPR = 315;
  export let goalBench = 275;
  export let goalSquat = 315;
  export let goalDeadlift = 365;
  export let isDarkMode = true;

  // Process data for visualization
  $: exerciseData = processExerciseData(days);
  
  function processExerciseData(days) {
    const data = {};
    
    days.forEach(day => {
      if (day.liftDone && day.exercise && day.liftWeight > 0) {
        if (!data[day.exercise]) {
          data[day.exercise] = [];
        }
        data[day.exercise].push({
          date: day.date,
          weight: day.liftWeight,
          dateString: day.date.toLocaleDateString()
        });
      }
    });
    
    // Sort each exercise data by date
    Object.keys(data).forEach(exercise => {
      data[exercise].sort((a, b) => a.date - b.date);
    });
    
    return data;
  }

  // Get the main exercises for PR tracking
  $: mainExercises = ['Bench Press', 'Squat', 'Deadlift'];
  $: exerciseColors = {
    'Bench Press': '#e74c3c',
    'Squat': '#3498db',
    'Deadlift': '#27ae60'
  };

  // Exercise goals mapping
  $: exerciseGoals = {
    'Bench Press': goalBench,
    'Squat': goalSquat,
    'Deadlift': goalDeadlift
  };

  // Calculate max weight including goals for better scaling
  $: maxWeight = Math.max(
    ...Object.values(exerciseData).flat().map(d => d.weight), 
    goalBench || 0,
    goalSquat || 0,
    goalDeadlift || 0,
    400
  );
  
  // SVG dimensions
  const svgWidth = 600;
  const svgHeight = 300;
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;

  function getXPosition(dataPoint, exerciseDataArray) {
    const index = exerciseDataArray.indexOf(dataPoint);
    return (index / (exerciseDataArray.length - 1)) * chartWidth;
  }

  function getYPosition(weight) {
    return chartHeight - (weight / maxWeight) * chartHeight;
  }

  function createPath(exerciseDataArray) {
    if (exerciseDataArray.length === 0) return '';
    
    let path = `M ${getXPosition(exerciseDataArray[0], exerciseDataArray)} ${getYPosition(exerciseDataArray[0].weight)}`;
    
    for (let i = 1; i < exerciseDataArray.length; i++) {
      path += ` L ${getXPosition(exerciseDataArray[i], exerciseDataArray)} ${getYPosition(exerciseDataArray[i].weight)}`;
    }
    
    return path;
  }

  // Calculate weight grid lines
  $: weightTicks = Array.from({length: 6}, (_, i) => Math.round((maxWeight / 5) * i));
</script>

<main class:dark-mode={isDarkMode} class:light-mode={!isDarkMode}>
  <div class="graphs-container">
    <header class="graphs-header">
      <h1>{userName}'s Progress Graphs</h1>
      <a href="#home" class="back-link">← Back to Dashboard</a>
    </header>

    <!-- PR Summary Cards with Goals -->
    <div class="pr-summary">
      <div class="pr-card bench">
        <h3>Bench Press</h3>
        <div class="pr-value">{benchPR} lbs</div>
        <div class="goal-display">Goal: {goalBench} lbs</div>
        <div class="progress-bar">
          <div class="progress-fill bench-fill" style="width: {Math.min((benchPR / goalBench) * 100, 100)}%"></div>
        </div>
        <div class="sessions">{exerciseData['Bench Press']?.length || 0} sessions</div>
      </div>
      <div class="pr-card squat">
        <h3>Squat</h3>
        <div class="pr-value">{squatPR} lbs</div>
        <div class="goal-display">Goal: {goalSquat} lbs</div>
        <div class="progress-bar">
          <div class="progress-fill squat-fill" style="width: {Math.min((squatPR / goalSquat) * 100, 100)}%"></div>
        </div>
        <div class="sessions">{exerciseData['Squat']?.length || 0} sessions</div>
      </div>
      <div class="pr-card deadlift">
        <h3>Deadlift</h3>
        <div class="pr-value">{deadliftPR} lbs</div>
        <div class="goal-display">Goal: {goalDeadlift} lbs</div>
        <div class="progress-bar">
          <div class="progress-fill deadlift-fill" style="width: {Math.min((deadliftPR / goalDeadlift) * 100, 100)}%"></div>
        </div>
        <div class="sessions">{exerciseData['Deadlift']?.length || 0} sessions</div>
      </div>
    </div>

    <!-- Main Progress Chart with Goal Lines -->
    <div class="chart-container">
      <h2>Weight Progress Over Time</h2>
      <svg width={svgWidth} height={svgHeight} class="progress-chart">
        <!-- Background -->
        <rect 
          width={svgWidth} 
          height={svgHeight} 
          fill={isDarkMode ? "#2a2a2a" : "#ffffff"} 
          rx="8"
          stroke={isDarkMode ? "none" : "#ddd"}
          stroke-width={isDarkMode ? "0" : "1"}
        />
        
        <!-- Chart area -->
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <!-- Grid lines (horizontal) -->
          {#each weightTicks as tick}
            <line 
              x1="0" 
              x2={chartWidth} 
              y1={getYPosition(tick)} 
              y2={getYPosition(tick)} 
              stroke={isDarkMode ? "#444" : "#e0e0e0"} 
              stroke-width="1"
              stroke-dasharray="2,2"
            />
            <text 
              x="-10" 
              y={getYPosition(tick) + 4} 
              fill={isDarkMode ? "#ccc" : "#666"} 
              text-anchor="end" 
              font-size="12"
            >
              {tick}
            </text>
          {/each}
          
          <!-- Goal lines (dashed) -->
          {#each mainExercises as exercise}
            {#if exerciseGoals[exercise] && exerciseGoals[exercise] > 0}
              <line 
                x1="0" 
                x2={chartWidth} 
                y1={getYPosition(exerciseGoals[exercise])} 
                y2={getYPosition(exerciseGoals[exercise])} 
                stroke={exerciseColors[exercise]} 
                stroke-width="2"
                stroke-dasharray="8,4"
                opacity="0.8"
                class="goal-line"
              />
              <text 
                x={chartWidth - 10} 
                y={getYPosition(exerciseGoals[exercise]) - 8} 
                fill={exerciseColors[exercise]} 
                text-anchor="end" 
                font-size="11"
                font-weight="bold"
                opacity="0.9"
              >
              </text>
            {/if}
          {/each}
          
          <!-- Exercise progress lines -->
          {#each mainExercises as exercise}
            {#if exerciseData[exercise] && exerciseData[exercise].length > 0}
              <path
                d={createPath(exerciseData[exercise])}
                stroke={exerciseColors[exercise]}
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              
              <!-- Data points -->
              {#each exerciseData[exercise] as dataPoint}
                <circle
                  cx={getXPosition(dataPoint, exerciseData[exercise])}
                  cy={getYPosition(dataPoint.weight)}
                  r="4"
                  fill={exerciseColors[exercise]}
                  stroke={isDarkMode ? "#fff" : "#333"}
                  stroke-width="2"
                >
                  <title>{exercise}: {dataPoint.weight} lbs on {dataPoint.dateString}</title>
                </circle>
              {/each}
            {/if}
          {/each}
          
          <!-- Axes -->
          <line 
            x1="0" 
            y1={chartHeight} 
            x2={chartWidth} 
            y2={chartHeight} 
            stroke={isDarkMode ? "#ccc" : "#666"} 
            stroke-width="2"
          />
          <line 
            x1="0" 
            y1="0" 
            x2="0" 
            y2={chartHeight} 
            stroke={isDarkMode ? "#ccc" : "#666"} 
            stroke-width="2"
          />
          
          <!-- Y-axis label -->
          <text 
            x="-40" 
            y={chartHeight / 2} 
            fill={isDarkMode ? "#ccc" : "#666"} 
            text-anchor="middle" 
            font-size="14"
            transform={`rotate(-90, -40, ${chartHeight / 2})`}
          >
            Weight (lbs)
          </text>
          
          <!-- X-axis label -->
          <text 
            x={chartWidth / 2} 
            y={chartHeight + 35} 
            fill={isDarkMode ? "#ccc" : "#666"} 
            text-anchor="middle" 
            font-size="14"
          >
            Workout Sessions
          </text>
        </g>
      </svg>
      
      <!-- Legend -->
      <div class="chart-legend">
        {#each mainExercises as exercise}
          {#if exerciseData[exercise] && exerciseData[exercise].length > 0}
            <div class="legend-item">
              <div class="legend-color" style="background-color: {exerciseColors[exercise]}"></div>
              <span>{exercise}</span>
            </div>
          {/if}
        {/each}
        <!-- Goal legend -->
        <div class="legend-item">
          <div class="legend-goal-line"></div>
          <span>Goals</span>
        </div>
      </div>
    </div>

    <!-- Exercise Details Tables -->
    <div class="exercise-details">
      <h2>Detailed Progress</h2>
      {#each mainExercises as exercise}
        {#if exerciseData[exercise] && exerciseData[exercise].length > 0}
          <div class="exercise-table">
            <h3 style="color: {exerciseColors[exercise]}">
              {exercise}
              {#if exerciseGoals[exercise]}
                <span class="goal-indicator">
                  (Goal: {exerciseGoals[exercise]} lbs - {Math.round((exerciseData[exercise][exerciseData[exercise].length - 1]?.weight / exerciseGoals[exercise]) * 100 || 0)}% achieved)
                </span>
              {/if}
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight (lbs)</th>
                  <th>Progress</th>
                  <th>To Goal</th>
                </tr>
              </thead>
              <tbody>
                {#each exerciseData[exercise] as session, index}
                  {@const prevWeight = index > 0 ? exerciseData[exercise][index - 1].weight : session.weight}
                  {@const progress = session.weight - prevWeight}
                  {@const toGoal = exerciseGoals[exercise] ? exerciseGoals[exercise] - session.weight : null}
                  <tr>
                    <td>{session.dateString}</td>
                    <td>{session.weight}</td>
                    <td class="progress-cell">
                      {#if progress > 0}
                        <span class="progress-up">+{progress}</span>
                      {:else if progress < 0}
                        <span class="progress-down">{progress}</span>
                      {:else}
                        <span class="progress-same">—</span>
                      {/if}
                    </td>
                    <td class="goal-cell">
                      {#if toGoal !== null}
                        {#if toGoal <= 0}
                          <span class="goal-achieved">✓ Goal Reached!</span>
                        {:else}
                          <span class="goal-remaining">{toGoal} lbs to go</span>
                        {/if}
                      {:else}
                        <span class="no-goal">—</span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</main>

<style>
  main {
    min-height: 100vh;
    padding: 2rem;
    transition: background-color 0.3s, color 0.3s;
  }

  /* Dark mode styles */
  .dark-mode {
    background: #222;
    color: #fff;
  }

  /* Light mode styles */
  .light-mode {
    background: #f5f5f5;
    color: #333;
  }

  .graphs-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .graphs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid;
    transition: border-color 0.3s;
  }

  .dark-mode .graphs-header {
    border-bottom-color: #444;
  }

  .light-mode .graphs-header {
    border-bottom-color: #ddd;
  }

  .graphs-header h1 {
    margin: 0;
  }

  .back-link {
    color: #4a90e2;
    text-decoration: none;
    font-size: 1.1rem;
    transition: color 0.2s;
  }

  .back-link:hover {
    color: #357abd;
  }

  .pr-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .pr-card {
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    border-left: 4px solid;
    transition: background-color 0.3s;
  }

  .dark-mode .pr-card {
    background: #2a2a2a;
  }

  .light-mode .pr-card {
    background: #fff;
    border: 1px solid #e0e0e0;
  }

  .pr-card.bench { border-left-color: #e74c3c; }
  .pr-card.squat { border-left-color: #3498db; }
  .pr-card.deadlift { border-left-color: #27ae60; }

  .pr-card h3 {
    margin: 0 0 0.5rem 0;
    transition: color 0.3s;
  }

  .dark-mode .pr-card h3 {
    color: #ccc;
  }

  .light-mode .pr-card h3 {
    color: #666;
  }

  .pr-value {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .sessions {
    font-size: 0.9rem;
    transition: color 0.3s;
  }

  .dark-mode .sessions {
    color: #999;
  }

  .light-mode .sessions {
    color: #777;
  }

  .chart-container {
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 3rem;
    transition: background-color 0.3s;
  }

  .dark-mode .chart-container {
    background: #2a2a2a;
  }

  .light-mode .chart-container {
    background: #fff;
    border: 1px solid #e0e0e0;
  }

  .chart-container h2 {
    margin: 0 0 1rem 0;
    text-align: center;
  }

  .progress-chart {
    display: block;
    margin: 0 auto;
  }

  .chart-legend {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legend-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  .exercise-details {
    border-radius: 12px;
    padding: 2rem;
    transition: background-color 0.3s;
  }

  .dark-mode .exercise-details {
    background: #2a2a2a;
  }

  .light-mode .exercise-details {
    background: #fff;
    border: 1px solid #e0e0e0;
  }

  .exercise-details h2 {
    margin: 0 0 2rem 0;
    text-align: center;
  }

  .exercise-table {
    margin-bottom: 2rem;
  }

  .exercise-table h3 {
    margin: 0 0 1rem 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 8px;
    overflow: hidden;
    transition: background-color 0.3s;
  }

  .dark-mode table {
    background: #333;
  }

  .light-mode table {
    background: #fff;
    border: 1px solid #e0e0e0;
  }

  th, td {
    padding: 0.75rem;
    text-align: left;
    transition: background-color 0.3s;
  }

  th {
    font-weight: bold;
  }

  .dark-mode th {
    background: #444;
  }

  .light-mode th {
    background: #f8f9fa;
    color: #333;
  }

  .dark-mode tr:nth-child(even) {
    background: #3a3a3a;
  }

  .light-mode tr:nth-child(even) {
    background: #f8f9fa;
  }

  .progress-cell {
    text-align: center;
  }

  .progress-up {
    color: #27ae60;
    font-weight: bold;
  }

  .progress-down {
    color: #e74c3c;
    font-weight: bold;
  }

  .progress-same {
    transition: color 0.3s;
  }

  .dark-mode .progress-same {
    color: #999;
  }

  .light-mode .progress-same {
    color: #777;
  }

  /* Goal-related styles */
  .goal-display {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    font-weight: bold;
    opacity: 0.9;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    overflow: hidden;
  }

  .dark-mode .progress-bar {
    background: #444;
  }

  .light-mode .progress-bar {
    background: #e0e0e0;
  }

  .progress-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.5s ease-in-out;
  }

  .bench-fill {
    background: #e74c3c;
  }

  .squat-fill {
    background: #3498db;
  }

  .deadlift-fill {
    background: #27ae60;
  }

  .goal-line {
    transition: opacity 0.3s;
  }

  .goal-line:hover {
    opacity: 1;
  }

  .legend-goal-line {
    width: 20px;
    height: 3px;
    background: repeating-linear-gradient(
      to right,
      #666 0px,
      #666 8px,
      transparent 8px,
      transparent 12px
    );
    border-radius: 2px;
  }

  .goal-indicator {
    font-size: 0.8rem;
    font-weight: normal;
    opacity: 0.8;
  }

  .goal-cell {
    text-align: center;
    font-size: 0.9rem;
  }

  .goal-achieved {
    color: #27ae60;
    font-weight: bold;
  }

  .goal-remaining {
    transition: color 0.3s;
  }

  .dark-mode .goal-remaining {
    color: #f39c12;
  }

  .light-mode .goal-remaining {
    color: #e67e22;
  }

  .no-goal {
    transition: color 0.3s;
  }

  .dark-mode .no-goal {
    color: #999;
  }

  .light-mode .no-goal {
    color: #777;
  }

  /* Enhanced table styles */
  table th:last-child,
  table td:last-child {
    text-align: center;
  }

  @media (max-width: 768px) {
    main {
      padding: 1rem;
    }

    .graphs-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .progress-chart {
      width: 100%;
      height: auto;
    }

    .chart-legend {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
