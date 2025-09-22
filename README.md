# Documentation
## Brief Description of Project
This project is based around a website which can be used to track lifting goals and weights which you have lifted. The primary focus for weights is bench press, deadlift, and squats as those are the main 3 exercises people reference when considering their gym progress.

## Design Work
Interview Results:

Q: What metrics are most important to you when it comes to gym progress?

A: the general concensus was that they were looking to see the increase over time of their weights as that is a very easy to see metric.

Q: how detailed would you want your tracking app/website to be?

A: both people had slightly different ideas on what details they would like, but the main idea was simplicity and they didn't want an 
overwhelming amount of data.

Q: how much time do you spend tracking your exercises and weights?

A: neither perrson currently used a tracking app for weight lifting, however one did use a calorie tracking app and values the ease of use in being able to quickly open the app, select a food and have the calories be tracked and simply displayed for the day.

From these interviews I gathered the idea of keeping the app as simple as possible which also inspired my simple mode button to keep it at maximum simplicity. I also decided on bench, squat, and deadlift for pr tracking to show gym progress which is prominently displayed on the screen.

Sketches:
[ui_sketches.pdf](https://github.com/user-attachments/files/22473404/ui_sketches.pdf)

Feedback: On my feedback I talked to a few people and we agreed that the calendar was a great idea as we could show day by day how consistent you've been at the gym, they also liked the progress bars and pr summary in the top right as its very obvious. They also really liked the bar idea with weights increasing with your pr, but I decided that would take too much time and I wouldn't be able to hit my other goals.


## Interface Details
Now to break into the interface. In the top left we display the user's name, the current date, the days they've tracked, and the length since they tracked their first day. I also put the buttons for some settings in the top right as well. There is the light mode/dark mode button to toggle coloring, the simple view/detailed view button which simplifies the inputs down to just whether or not you lifted as well as the past entries will only show a yes or no for whether you lifted that day. 

<img width="692" height="281" alt="image" src="https://github.com/user-attachments/assets/c9d4247d-90d1-41a7-b136-d282707712de" />

Finally there is the goal setting button which you can click to update your goals. The goal setting button will toggle a pane on the right side of the screen with buttons to update them.

<img width="692" height="573" alt="image" src="https://github.com/user-attachments/assets/81c4b949-0b34-49ba-b207-8399c08e45ac" />

The bottom left portion of the site is the input for your tracking. It contains the date which you are inputting the information for, and it will tell you whether you are editing or not. It also contains a checkbox which you can check to say whether you lifted today or not, which is the only option which will show when you turn on simple mode. 

<img width="655" height="473" alt="image" src="https://github.com/user-attachments/assets/183a8880-764a-425f-9938-239811617bab" />

Then is the exercise group button which contains push, pull, and legs and the next box contains the exercises and they are limited to omly exercises that fit into that group. Next is the input for the amount of weight you lifted as well as one for the amount of calories you have eaten that day. When clicking on the calendar on the right on a day you tracked, it will populate these with that and you are able to update them as well. Finally is the submit button which will display "Entry Saved!" whenever you press it.

<img width="655" height="473" alt="image" src="https://github.com/user-attachments/assets/87d82e55-b0d8-42e2-9c3b-11f1199b49d4" />
<img width="655" height="473" alt="image" src="https://github.com/user-attachments/assets/6940ee66-533d-4fa9-84a9-4b352a601e45" />

Next is the right side of the screen which contains two different areas. There is the PR section which shows your current PR in the circle which a ring on the outside which indicates how close you are to reaching your goal which you set. It also displays the actual number for your goal below the circles. Another thing to note about this area is that it is a button which takes you to the pr graph page.

<img width="655" height="238" alt="image" src="https://github.com/user-attachments/assets/7e654113-92aa-4843-b2a7-3da67ece5ac0" />

The bottom section is a calendar which displays days you have lifted on which a green circle, and the current day with a red circle until you lift. If you enter weights or any info and don't check lifted today, it will also display a red circle to indicate that. When you click on a day it displays all the details below, with only the did you lift section displaying when you are in simple mode. You can also click the arrow buttons on the calendar to navigate to past or future months and you can update those as well. If you click the month box in the middle it will take you back to the current month and day.

<img width="655" height="577" alt="image" src="https://github.com/user-attachments/assets/7200cd4c-4374-4ce0-b933-7707285581fd" />

Finally is the pr-graph page. This page displays your current PRs with bars at the bottom to show how close you are to reaching them, similar to the circles on the main page.

<img width="709" height="320" alt="image" src="https://github.com/user-attachments/assets/604259d6-a082-4104-8911-619a5cd09186" />

Next is the weight over time graph, which shows a timeline of the weights you have inputted and showing them visually each with different colors. There are also horizontal, dashed lines to show your goals which can be used to see your trends and if you are moving in the right direction.

<img width="709" height="463" alt="image" src="https://github.com/user-attachments/assets/88a07192-8ce8-46e8-85ba-ad0518fc4674" />

At the bottom of this page, I added a detailed progress section which shows your weights itemized with dates and change in weight between them to make the data visible in another way that may be easier if you are looking for a specific day. It also has lbs to the goal as well as % you are too the goal to furher help motivate and inform you on your progress.

<img width="709" height="645" alt="image" src="https://github.com/user-attachments/assets/c53c93c7-13b2-4aa8-a36e-39dd8c7b6d1e" />

## Implementation Details

The code to this project is honestly not formatted great, but I have variables for various global constants which are used and passed between pages, such as userName, startDate, benchPR, squatPR, deadliftPR, goalBench, goalSquat, goalDeadlift, showGoalEditor, isDarkMode, etc. Then I use functions which are called from the code to modify these variables and use their values to determiine what to do. One such simple example is toggleGoalEditor which inverts the value of showGoalEditor when the matching button is pushed. I have a lot of functions like this. There is also another main driving function which is handleSubmit that is used to update and trigger a lot of these other functions whenever a value is updated, such as needing to update the max PR or the values within an old date or current date. The code for the calendar is also quite complex and has multiple functions associated, such as getDaysInMonth, findEntry, goToPreviousMonth, goToNextMonth, selectDay, and goToCurrentMonth. Finally is the data storage which is in days, and is an array of objects.

## Use of AI

I did use AI quite a bit when creating this website. I tried to limit it to getting a boiler plate for the project, receiving help when I was stumped or didn't know where to start, debugging issues I ran into, creating the circle svg's and the rings around them, and cleaning up css so that it worked well together. AI is something that's hard to get around as with copilot it often autofinishes lines or even predicts what you are trying to make, so there may be a bit more than just that, but I would honestly like to ease off on AI use in the future and possibly even disable it when trying to learn to avoid that.

## Future Work

If I were to continue working on this site, the first thing I would do is incorporate a backend so user data is persistent. I would also like to move the toggle buttons like simple mode or dark mode under a settings wheel. I would also make filters possible for the PR graph so you can look at one exercise at a time and also include the data from the other exercises not included in PR. Another thing I would do is let people track multiple exercises a day instead of just the main one. The form to update and log a day also could look better as it is quite simple looking now. Along with that I would also add the ability to remove items from the "Form" for logging so you only have to log what you want.

## Demo Video

## Links
Code: https://github.com/elipappas/ui-tracking-project/
Website: https://elipappas.github.io/ui-tracking-project/#home
