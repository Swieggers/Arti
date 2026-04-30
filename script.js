const STORAGE_KEY = 'arti-exercise-log';
const WEIGHT_KEY = 'arti-exercise-last-weight';
const form = document.getElementById('exercise-form');
const exerciseList = document.getElementById('exercise-list');
const clearButton = document.getElementById('clear-button');
const programButtons = document.querySelectorAll('.program-day');
const programDetails = document.getElementById('program-details');
const exerciseNameInput = document.getElementById('exercise-name');
const repsInput = document.getElementById('reps');
const weightInput = document.getElementById('weight');

let exercises = [];
let lastWeights = {};
let selectedDay = 1;

const programDays = {
  1: [
    {
      name: 'Goblet Squat (use bench if needed)',
      target: '3 sets x 6-10 reps',
      notes: 'Keep chest upright and use a bench for safety if needed.',
      loggable: true,
    },
    {
      name: 'Dumbbell Bench Press',
      target: '3 sets x 6-10 reps',
      notes: 'Choose a comfortable dumbbell weight and focus on control.',
      loggable: true,
    },
    {
      name: 'Lat Pulldown or Row',
      target: '3 sets x 6-10 reps',
      notes: 'Use what is available in the gym and keep form slow and steady.',
      loggable: true,
    },
    {
      name: 'Seated Shoulder Press',
      target: 'Superset with 3 sets x 6-10 reps',
      notes: 'Press with a controlled motion, then move immediately to curls.',
      loggable: true,
    },
    {
      name: 'Bicep Curls',
      target: 'Superset with 3 sets x 6-10 reps',
      notes: 'Keep elbows locked in place and avoid swinging the weight.',
      loggable: true,
    },
    {
      name: 'Incline Treadmill Walk',
      target: '15-30 minutes at speed 5 and 5% incline',
      notes: 'Finish every workout with a steady walk to support conditioning.',
      loggable: false,
    },
  ],
  2: [],
  3: [],
};

programDays[2] = JSON.parse(JSON.stringify(programDays[1]));
programDays[3] = JSON.parse(JSON.stringify(programDays[1]));

function saveExercises() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));
}

function saveLastWeights() {
  localStorage.setItem(WEIGHT_KEY, JSON.stringify(lastWeights));
}

function loadExercises() {
  const saved = localStorage.getItem(STORAGE_KEY);
  exercises = saved ? JSON.parse(saved) : [];
}

function loadLastWeights() {
  const saved = localStorage.getItem(WEIGHT_KEY);
  lastWeights = saved ? JSON.parse(saved) : {};
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderProgram() {
  programDetails.innerHTML = '';
  const exercisesForDay = programDays[selectedDay];

  exercisesForDay.forEach((exercise) => {
    const card = document.createElement('article');
    card.className = 'exercise-card';

    const header = document.createElement('div');
    header.className = 'exercise-card-header';
    const title = document.createElement('h3');
    title.className = 'exercise-card-title';
    title.textContent = exercise.name;
    const meta = document.createElement('span');
    meta.className = 'exercise-card-meta';
    meta.textContent = exercise.target;

    header.append(title, meta);
    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'exercise-card-body';

    if (exercise.notes) {
      const notes = document.createElement('p');
      notes.textContent = exercise.notes;
      body.appendChild(notes);
    }

    if (lastWeights[exercise.name]) {
      const lastUsed = document.createElement('p');
      lastUsed.textContent = `Last weight: ${lastWeights[exercise.name]} kg`;
      body.appendChild(lastUsed);
    }

    card.appendChild(body);

    const actions = document.createElement('div');
    actions.className = 'exercise-card-actions';

    const actionButton = document.createElement('button');
    actionButton.className = 'secondary-button';
    actionButton.type = 'button';
    actionButton.textContent = exercise.loggable ? 'Load to log' : 'Review';
    actionButton.addEventListener('click', () => {
      if (exercise.loggable) {
        loadExerciseIntoForm(exercise);
      } else {
        exerciseNameInput.value = exercise.name;
        repsInput.value = '';
        weightInput.value = '';
        repsInput.focus();
      }
    });

    actions.appendChild(actionButton);
    card.appendChild(actions);
    programDetails.appendChild(card);
  });
}

function loadExerciseIntoForm(exercise) {
  exerciseNameInput.value = exercise.name;
  repsInput.value = '';
  weightInput.value = lastWeights[exercise.name] || '';
  repsInput.focus();
}

function renderExercises() {
  exerciseList.innerHTML = '';

  if (exercises.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No entries yet. Add the first workout above.';
    exerciseList.appendChild(empty);
    return;
  }

  exercises.slice().reverse().forEach((exercise, index) => {
    const card = document.createElement('article');
    card.className = 'card';

    const header = document.createElement('div');
    header.className = 'card-header';
    const title = document.createElement('h3');
    title.textContent = exercise.name;
    const meta = document.createElement('span');
    meta.className = 'card-meta';
    meta.textContent = `${formatDate(exercise.date)} · ${exercise.reps} reps · ${exercise.weight} kg`;

    header.append(title, meta);
    card.appendChild(header);

    const body = document.createElement('div');
    body.className = 'card-body';

    if (exercise.notes) {
      const notes = document.createElement('p');
      notes.textContent = `Notes: ${exercise.notes}`;
      body.appendChild(notes);
    }

    if (exercise.videoUrl) {
      const video = document.createElement('p');
      video.innerHTML = `Video: <a href="${exercise.videoUrl}" target="_blank" rel="noreferrer">Watch how to do it</a>`;
      body.appendChild(video);
    }

    card.appendChild(body);

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    if (exercise.videoUrl) {
      const openVideo = document.createElement('a');
      openVideo.className = 'link-button';
      openVideo.href = exercise.videoUrl;
      openVideo.target = '_blank';
      openVideo.rel = 'noreferrer';
      openVideo.textContent = 'Open video';
      actions.appendChild(openVideo);
    }

    const removeButton = document.createElement('button');
    removeButton.className = 'secondary-button delete-button';
    removeButton.type = 'button';
    removeButton.textContent = 'Delete';
    removeButton.addEventListener('click', () => {
      const realIndex = exercises.length - 1 - index;
      exercises.splice(realIndex, 1);
      saveExercises();
      renderExercises();
    });
    actions.appendChild(removeButton);

    card.appendChild(actions);
    exerciseList.appendChild(card);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const newExercise = {
    id: Date.now(),
    name: formData.get('exerciseName').trim(),
    date: new Date().toISOString(),
    reps: Number(formData.get('reps')) || 0,
    weight: Number(formData.get('weight')) || 0,
  };

  if (newExercise.name && newExercise.weight > 0) {
    lastWeights[newExercise.name] = newExercise.weight;
    saveLastWeights();
  }

  exercises.push(newExercise);
  saveExercises();
  renderExercises();
  renderProgram();
  form.reset();
});

clearButton.addEventListener('click', () => {
  if (!confirm('Clear all exercise entries?')) {
    return;
  }
  exercises = [];
  saveExercises();
  renderExercises();
});

programButtons.forEach((button) => {
  button.addEventListener('click', () => {
    programButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    selectedDay = Number(button.dataset.day);
    renderProgram();
  });
});

loadExercises();
loadLastWeights();
renderProgram();
renderExercises();
