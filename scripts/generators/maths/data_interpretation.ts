import { GeneratedQuestion } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(correct: string, distractors: string[]): string[] {
  const opts = new Set<string>();
  opts.add(correct);
  for (const d of distractors) {
    if (d !== correct) opts.add(d);
  }
  while (opts.size < 4) {
    const n = parseFloat(correct.replace(/[£,]/g, '')) || 1;
    opts.add(String(n + opts.size));
  }
  return shuffle(Array.from(opts).slice(0, 4));
}

export function generateDataInterpretationQuestions(): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];

  const barSingleStep: {
    title: string; xLabels: string[]; values: number[]; yMax: number;
    questionText: string; correct: string; distractors: string[]; d: number;
  }[] = [
    { title: 'Books Read by Pupils', xLabels: ['Alice', 'Ben', 'Charlotte', 'David', 'Emily'], values: [7, 4, 9, 3, 6], yMax: 12, questionText: 'How many books did Charlotte read?', correct: '9', distractors: ['7', '6', '4'], d: 1 },
    { title: 'Goals Scored This Season', xLabels: ['Year 3', 'Year 4', 'Year 5', 'Year 6'], values: [12, 8, 15, 10], yMax: 20, questionText: 'Which year group scored the most goals?', correct: 'Year 5', distractors: ['Year 3', 'Year 6', 'Year 4'], d: 1 },
    { title: 'Favourite School Subjects', xLabels: ['Maths', 'English', 'Science', 'Art', 'PE'], values: [14, 10, 12, 8, 16], yMax: 20, questionText: 'How many pupils chose Maths as their favourite?', correct: '14', distractors: ['12', '16', '10'], d: 1 },
    { title: 'Ice Cream Sales', xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [20, 15, 25, 18, 30], yMax: 35, questionText: 'On which day were the fewest ice creams sold?', correct: 'Tue', distractors: ['Mon', 'Thu', 'Wed'], d: 1 },
    { title: 'Rainfall in Birmingham (mm)', xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], values: [70, 50, 55, 45, 60, 40], yMax: 80, questionText: 'How much rainfall was there in March?', correct: '55', distractors: ['50', '60', '45'], d: 1 },
    { title: 'Cars in Car Park', xLabels: ['9am', '10am', '11am', '12pm', '1pm'], values: [15, 28, 35, 40, 32], yMax: 45, questionText: 'At what time were there the most cars?', correct: '12pm', distractors: ['11am', '1pm', '10am'], d: 1 },
    { title: 'Pupils Walking to School', xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [45, 38, 42, 50, 35], yMax: 55, questionText: 'How many pupils walked on Thursday?', correct: '50', distractors: ['45', '42', '38'], d: 1 },
    { title: 'Sandwiches Sold at Tuck Shop', xLabels: ['Cheese', 'Ham', 'Tuna', 'Egg'], values: [22, 18, 14, 10], yMax: 25, questionText: 'How many cheese sandwiches were sold?', correct: '22', distractors: ['18', '14', '10'], d: 1 },
    { title: 'Library Visits in Leeds', xLabels: ['Jan', 'Feb', 'Mar', 'Apr'], values: [120, 95, 110, 130], yMax: 150, questionText: 'In which month were there the most library visits?', correct: 'Apr', distractors: ['Jan', 'Mar', 'Feb'], d: 1 },
    { title: 'Pets Owned by Class 5B', xLabels: ['Dog', 'Cat', 'Fish', 'Rabbit', 'Hamster'], values: [9, 7, 4, 3, 5], yMax: 12, questionText: 'How many pupils own a cat?', correct: '7', distractors: ['9', '5', '4'], d: 1 },
  ];
  for (const c of barSingleStep) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: c.questionText,
      options: makeOptions(c.correct, c.distractors),
      correctAnswer: c.correct,
      difficulty: 'easy',
      skillId: 'maths.data', subRuleId: 'maths.data.bar_single_step',
      renderType: 'chart',
      renderConfig: { kind: 'chart.bar', title: c.title, xLabels: c.xLabels, values: c.values, yMax: c.yMax, questionText: c.questionText },
      trapTypes: ['wrong_category'],
      cognitiveLoad: 1, estTimeSeconds: 20,
      explanation: `Read the value directly from the bar chart: ${c.correct}.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const barTwoStep: {
    title: string; xLabels: string[]; values: number[]; yMax: number;
    questionText: string; correct: string; distractors: string[]; d: number;
  }[] = [
    { title: 'Books Read by Pupils', xLabels: ['Alice', 'Ben', 'Charlotte', 'David', 'Emily'], values: [7, 4, 9, 3, 6], yMax: 12, questionText: 'How many more books did Charlotte read than Ben?', correct: '5', distractors: ['4', '6', '3'], d: 2 },
    { title: 'Goals Scored This Season', xLabels: ['Year 3', 'Year 4', 'Year 5', 'Year 6'], values: [12, 8, 15, 10], yMax: 20, questionText: 'How many goals were scored in total by all year groups?', correct: '45', distractors: ['43', '47', '40'], d: 2 },
    { title: 'Favourite Fruits', xLabels: ['Apple', 'Banana', 'Orange', 'Grape', 'Strawberry'], values: [15, 12, 8, 5, 10], yMax: 18, questionText: 'How many more pupils chose Apple than Orange?', correct: '7', distractors: ['8', '5', '3'], d: 2 },
    { title: 'Swimming Lengths by Day', xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [10, 14, 8, 16, 12], yMax: 20, questionText: 'What is the total number of lengths swum on Monday and Friday?', correct: '22', distractors: ['24', '20', '26'], d: 2 },
    { title: 'Cakes Sold at Manchester Bakery', xLabels: ['Victoria Sponge', 'Carrot', 'Lemon Drizzle', 'Chocolate'], values: [25, 18, 20, 30], yMax: 35, questionText: 'How many fewer Carrot cakes were sold than Chocolate cakes?', correct: '12', distractors: ['10', '8', '15'], d: 2 },
    { title: 'Points Scored in Quiz', xLabels: ['Team A', 'Team B', 'Team C', 'Team D'], values: [35, 28, 42, 31], yMax: 50, questionText: 'What is the difference between the highest and lowest scores?', correct: '14', distractors: ['12', '7', '11'], d: 2 },
    { title: 'Flowers in Bristol Garden', xLabels: ['Roses', 'Tulips', 'Daffodils', 'Lilies'], values: [20, 15, 25, 10], yMax: 30, questionText: 'How many flowers are there altogether?', correct: '70', distractors: ['65', '75', '60'], d: 2 },
    { title: 'Minutes of Exercise', xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [30, 45, 20, 50, 35], yMax: 55, questionText: 'What is the mean number of minutes of exercise per day?', correct: '36', distractors: ['35', '38', '30'], d: 3 },
    { title: 'Visitors to Edinburgh Castle', xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [120, 95, 150, 110, 135], yMax: 160, questionText: 'How many more visitors came on Wednesday than Tuesday?', correct: '55', distractors: ['50', '60', '45'], d: 2 },
    { title: 'Pupils in After-School Clubs', xLabels: ['Football', 'Netball', 'Chess', 'Drama', 'Art'], values: [18, 14, 8, 12, 10], yMax: 20, questionText: 'How many pupils are in Football and Netball combined?', correct: '32', distractors: ['30', '28', '34'], d: 2 },
  ];
  for (const c of barTwoStep) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: c.questionText,
      options: makeOptions(c.correct, c.distractors),
      correctAnswer: c.correct,
      difficulty: c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.data', subRuleId: 'maths.data.bar_two_step',
      renderType: 'chart',
      renderConfig: { kind: 'chart.bar', title: c.title, xLabels: c.xLabels, values: c.values, yMax: c.yMax, questionText: c.questionText },
      trapTypes: ['off_by_one', 'subtract_vs_add'],
      cognitiveLoad: c.d, estTimeSeconds: 25 + c.d * 5,
      explanation: `Read values from the chart and calculate: ${c.correct}.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const lineSingleStep: {
    title: string; xLabels: string[]; values: number[]; yMax: number;
    questionText: string; correct: string; distractors: string[]; d: number;
  }[] = [
    { title: 'Temperature in London (°C)', xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], values: [4, 5, 8, 12, 16, 19], yMax: 25, questionText: 'What was the temperature in April?', correct: '12', distractors: ['8', '16', '10'], d: 1 },
    { title: 'Temperature in Manchester (°C)', xLabels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], values: [18, 17, 14, 10, 7, 4], yMax: 22, questionText: 'In which month was the temperature 14°C?', correct: 'Sep', distractors: ['Oct', 'Aug', 'Nov'], d: 1 },
    { title: 'Plant Growth (cm)', xLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'], values: [2, 5, 9, 14, 20], yMax: 25, questionText: 'How tall was the plant in Week 3?', correct: '9', distractors: ['5', '14', '7'], d: 1 },
    { title: 'Daily Sunshine Hours in Cardiff', xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [3, 5, 2, 6, 4, 8, 7], yMax: 10, questionText: 'On which day was there the most sunshine?', correct: 'Sat', distractors: ['Sun', 'Thu', 'Fri'], d: 1 },
    { title: 'Pond Water Level (cm)', xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], values: [45, 42, 38, 35, 30], yMax: 50, questionText: 'What was the water level in February?', correct: '42', distractors: ['45', '38', '40'], d: 1 },
    { title: 'Speed of Cyclist (mph)', xLabels: ['0 min', '5 min', '10 min', '15 min', '20 min'], values: [0, 8, 15, 12, 18], yMax: 22, questionText: 'What was the speed at 10 minutes?', correct: '15', distractors: ['12', '8', '18'], d: 1 },
    { title: 'Attendance at York Swimming Pool', xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [45, 52, 38, 60, 55], yMax: 65, questionText: 'On which day was attendance lowest?', correct: 'Wed', distractors: ['Mon', 'Tue', 'Fri'], d: 1 },
    { title: 'Temperature in Glasgow (°C)', xLabels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'], values: [3, 7, 12, 14, 10, 6], yMax: 18, questionText: 'What was the highest temperature recorded?', correct: '14', distractors: ['12', '10', '15'], d: 1 },
    { title: 'Weight of Puppy (kg)', xLabels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'], values: [2, 3, 5, 7, 9, 11], yMax: 14, questionText: 'How much did the puppy weigh in Month 4?', correct: '7', distractors: ['5', '9', '6'], d: 1 },
    { title: 'Electricity Usage in Norwich (kWh)', xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], values: [350, 320, 280, 220, 180, 150], yMax: 400, questionText: 'In which month was the usage 280 kWh?', correct: 'Mar', distractors: ['Feb', 'Apr', 'Jan'], d: 1 },
  ];
  for (const c of lineSingleStep) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: c.questionText,
      options: makeOptions(c.correct, c.distractors),
      correctAnswer: c.correct,
      difficulty: 'easy',
      skillId: 'maths.data', subRuleId: 'maths.data.line_single_step',
      renderType: 'chart',
      renderConfig: { kind: 'chart.line', title: c.title, xLabels: c.xLabels, values: c.values, yMax: c.yMax, questionText: c.questionText },
      trapTypes: ['wrong_category'],
      cognitiveLoad: 1, estTimeSeconds: 20,
      explanation: `Read the value from the line chart: ${c.correct}.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  const tableTwoStep: {
    title: string; headers: string[]; rows: (string | number)[][];
    questionText: string; correct: string; distractors: string[]; d: number;
  }[] = [
    { title: 'Spelling Test Results', headers: ['Name', 'Score'], rows: [['Alice', 85], ['Ben', 72], ['Charlotte', 90], ['David', 68], ['Emily', 78]], questionText: 'What is the difference between the highest and lowest scores?', correct: '22', distractors: ['18', '20', '25'], d: 2 },
    { title: 'Tuck Shop Prices', headers: ['Item', 'Price (£)'], rows: [['Apple', 0.45], ['Biscuit', 0.30], ['Juice', 0.75], ['Sandwich', 1.20], ['Crisps', 0.55]], questionText: 'How much would 2 juices and 1 sandwich cost?', correct: '£2.70', distractors: ['£2.75', '£1.95', '£3.15'], d: 2 },
    { title: 'Pupils in Each House', headers: ['House', 'Boys', 'Girls'], rows: [['Red', 15, 18], ['Blue', 12, 14], ['Green', 17, 13], ['Yellow', 10, 16]], questionText: 'How many pupils are in Green House altogether?', correct: '30', distractors: ['26', '17', '13'], d: 2 },
    { title: 'Train Timetable from Bristol', headers: ['Destination', 'Departs', 'Arrives'], rows: [['London', '09:15', '11:00'], ['Cardiff', '09:30', '10:15'], ['Birmingham', '10:00', '11:30'], ['Exeter', '10:45', '12:00']], questionText: 'How long does the journey to Birmingham take?', correct: '1 hour 30 minutes', distractors: ['1 hour 15 minutes', '2 hours', '1 hour 45 minutes'], d: 2 },
    { title: 'Favourite Colours Survey', headers: ['Colour', 'Year 5', 'Year 6'], rows: [['Blue', 12, 15], ['Red', 8, 10], ['Green', 6, 9], ['Yellow', 4, 6]], questionText: 'How many pupils in total chose Blue?', correct: '27', distractors: ['15', '12', '25'], d: 2 },
    { title: 'Book Fair Sales (£)', headers: ['Day', 'Fiction', 'Non-Fiction'], rows: [['Monday', 45, 30], ['Tuesday', 38, 25], ['Wednesday', 52, 40], ['Thursday', 41, 35]], questionText: 'What were the total sales on Wednesday?', correct: '£92', distractors: ['£52', '£40', '£90'], d: 2 },
    { title: 'Distance Between Cities (miles)', headers: ['From', 'To', 'Distance'], rows: [['London', 'Birmingham', 126], ['London', 'Manchester', 209], ['London', 'Edinburgh', 414], ['Birmingham', 'Leeds', 118]], questionText: 'How much further is Edinburgh from London than Birmingham from London?', correct: '288', distractors: ['290', '285', '300'], d: 2 },
    { title: 'School Dinner Choices', headers: ['Meal', 'Monday', 'Tuesday', 'Wednesday'], rows: [['Pasta', 25, 30, 28], ['Curry', 18, 22, 20], ['Jacket Potato', 12, 8, 15]], questionText: 'How many pupils chose Curry across all three days?', correct: '60', distractors: ['58', '62', '55'], d: 2 },
    { title: 'Savings Account Balance (£)', headers: ['Month', 'Deposit', 'Balance'], rows: [['January', 50, 50], ['February', 30, 80], ['March', 45, 125], ['April', 25, 150]], questionText: 'How much was deposited in total over the four months?', correct: '£150', distractors: ['£125', '£155', '£100'], d: 2 },
    { title: 'Sports Day Results (points)', headers: ['House', 'Running', 'Throwing', 'Jumping'], rows: [['Oak', 45, 38, 42], ['Elm', 40, 44, 36], ['Ash', 48, 35, 40], ['Birch', 37, 42, 45]], questionText: 'Which house scored the most points in total?', correct: 'Ash', distractors: ['Birch', 'Oak', 'Elm'], d: 3 },
  ];
  for (const c of tableTwoStep) {
    questions.push({
      section: 'Mathematics', type: 'multiple_choice',
      prompt: c.questionText,
      options: makeOptions(c.correct, c.distractors),
      correctAnswer: c.correct,
      difficulty: c.d <= 2 ? 'medium' : 'hard',
      skillId: 'maths.data', subRuleId: 'maths.data.table_two_step',
      renderType: 'chart',
      renderConfig: { kind: 'chart.table', title: c.title, headers: c.headers, rows: c.rows, questionText: c.questionText },
      trapTypes: ['off_by_one', 'wrong_category', 'subtract_vs_add'],
      cognitiveLoad: c.d, estTimeSeconds: 30 + c.d * 5,
      explanation: `Read the relevant values from the table and calculate: ${c.correct}.`,
      qaStatus: 'approved', locale: 'en-GB', britishSpelling: true, version: 1,
    });
  }

  return questions;
}
