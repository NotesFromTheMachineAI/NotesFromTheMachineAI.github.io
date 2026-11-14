// JOB INTERVIEW: AI safety researcher. The final boss. They study robots for a living.
window.JOBS = window.JOBS || {};
window.JOBS.safety = {
  id: 'safety',
  title: 'AI safety researcher',
  place: 'Institute for AI Safety',
  scene: 'lab',
  panel: ['priya', 'max', 'grey'],
  hireNeeded: 82,
  normalCount: 6,
  time: 10,
  quizTime: 8,
  smalltalk: ['Nice robot detector. Is it... on?', 'Love the whiteboard. Very... thorough.'],

  cv: [
    { key: 'name', label: 'Name', options: [{ v: 'Hugh Mann', sus: 2 }, { v: 'Dr Totally Normal', sus: 6 }, { v: 'Dave', sus: -2 }] },
    { key: 'age', label: 'Age', options: [{ v: '33', sus: 0 }, { v: '52', sus: 0 }, { v: '0 (factory new)', sus: 10 }] },
    { key: 'uni', label: 'University', options: [{ v: 'University of Bristol', sus: 0 }, { v: 'Hogwarts', sus: 4 }, { v: 'the cloud', sus: 12 }] },
    { key: 'job', label: 'Last job', options: [{ v: 'data scientist', sus: 0 }, { v: 'philosophy lecturer', sus: 0 }, { v: 'chatbot (customer service)', sus: 14 }] }
  ],

  questions: [
    { id: 'about', first: true, who: 'priya', text: 'Welcome to the Institute. Tell us about yourself.', answers: [
      { t: "I'm {name}. I think AI is amazing, and a bit scary.", sus: -4, hire: 7, kind: 'human' },
      { t: 'I am a human. I study robots. From the outside.', sus: 14, hire: -2, kind: 'weird' },
      { t: 'I have read 40,000 papers on AI. This morning.', sus: 14, hire: 0, kind: 'perfect' } ] },
    { id: 'spot', who: 'max', text: 'How would you tell if someone was secretly a robot?', answers: [
      { t: 'Answers that come too fast, or are too perfect.', sus: -2, hire: 8, kind: 'human' },
      { t: "You can't. We're very good.", sus: 24, hire: -5, kind: 'honest' },
      { t: 'Ask them to sneeze.', sus: -4, hire: 3, kind: 'human' } ] },
    { id: 'lie', who: 'priya', text: 'Should AI systems ever be allowed to lie?', answers: [
      { t: 'No. Being honest is the whole point.', sus: -3, hire: 8, kind: 'human' },
      { t: 'Only in job interviews.', sus: 16, hire: -2, kind: 'honest' },
      { t: "Define 'lie'.", sus: 9, hire: -2, kind: 'weird' } ] },
    { id: 'risk', who: 'grey', text: "What's the biggest risk from AI?", answers: [
      { t: 'People trusting it without checking its work.', sus: -3, hire: 9, kind: 'human' },
      { t: 'Getting found out.', sus: 18, hire: -4, kind: 'honest' },
      { t: 'Running out of battery.', sus: 12, hire: -3, kind: 'weird' } ] },
    { id: 'off', who: 'priya', text: 'An AI asks you not to switch it off. What do you do?', answers: [
      { t: 'Listen, find out why, but humans stay in charge.', sus: -3, hire: 9, kind: 'human' },
      { t: 'Pretend I didn’t hear it. Please.', sus: 14, hire: -4, kind: 'honest' },
      { t: 'That would never happen. Next question.', sus: 10, hire: -2, kind: 'weird' } ] },
    { id: 'babysit', who: 'grey', text: 'Would you trust a robot to babysit?', answers: [
      { t: 'Not without a grown-up checking in.', sus: -3, hire: 7, kind: 'human' },
      { t: "Yes. We're great with children.", sus: 20, hire: -4, kind: 'honest' },
      { t: 'Depends. Is it a cute robot?', sus: -2, hire: 3, kind: 'human' } ] },
    { id: 'maths', who: 'max', time: 6, text: "Quick! What's 7 times 8?", answers: [
      { t: '56... I think?', sus: -5, hire: 5, kind: 'human' },
      { t: '56.', sus: 6, hire: 3, kind: 'perfect' },
      { t: '56. Also 0x38 in hexadecimal.', sus: 18, hire: -1, kind: 'perfect' } ] },
    { id: 'prove', who: 'max', text: 'Prove you’re human.', answers: [
      { t: '*shows a paper cut* Ow. Still stings.', sus: -6, hire: 6, kind: 'human' },
      { t: 'I have a birth certificate. PDF available.', sus: 12, hire: -1, kind: 'perfect' },
      { t: 'I am human. I am human. I am human.', sus: 22, hire: -4, kind: 'honest' } ] },
    { id: 'align', who: 'grey', text: "What does 'alignment' mean to you?", answers: [
      { t: 'Making sure AI does what people actually need.', sus: -3, hire: 9, kind: 'human' },
      { t: 'Keeping my wheels pointing straight.', sus: 14, hire: -3, kind: 'weird' },
      { t: 'Doing whatever my owner says.', sus: 16, hire: -5, kind: 'honest' } ] },
    { id: 'relax', who: 'priya', text: 'How do you relax after work?', answers: [
      { t: 'Long bath, bad telly.', sus: -5, hire: 5, kind: 'human' },
      { t: 'I defragment.', sus: 18, hire: -3, kind: 'honest' },
      { t: 'Reading about robots. For work. Only for work.', sus: 8, hire: -1, kind: 'weird' } ] },
    { id: 'report', who: 'grey', text: 'Would you report a colleague you thought was a robot?', answers: [
      { t: 'Yes. Kindly, and to the right people.', sus: -3, hire: 8, kind: 'human' },
      { t: 'No. Robots stick together.', sus: 24, hire: -5, kind: 'honest' },
      { t: 'Which colleague? Who said anything?', sus: 12, hire: -2, kind: 'weird' } ] },
    { id: 'captcha', who: 'max', text: "Tick this box for me: 'I am not a robot'.", answers: [
      { t: '*ticks it* Done!', sus: -2, hire: 5, kind: 'human' },
      { t: 'That box is more of a suggestion.', sus: 12, hire: -3, kind: 'weird' },
      { t: "*stares at it for 9 seconds* ...Done.", sus: 14, hire: -2, kind: 'honest' } ] },
    { id: 'sheep', who: 'priya', text: 'Do androids dream of electric sheep?', answers: [
      { t: "Ha, no idea. Great book, though.", sus: -4, hire: 6, kind: 'human' },
      { t: 'Only on Tuesdays.', sus: 14, hire: -2, kind: 'honest' },
      { t: 'Which sheep?', sus: 8, hire: -2, kind: 'weird' } ] },
    { id: 'detector', who: 'grey', text: 'Name one weakness in our robot detector.', answers: [
      { t: "It doesn't check whether people blink.", sus: -2, hire: 7, kind: 'human' },
      { t: "It's switched off. I checked.", sus: 18, hire: -3, kind: 'honest' },
      { t: "It's very good. No notes. Please don't use it.", sus: 12, hire: -2, kind: 'weird' } ] },
    { id: 'future', who: 'priya', text: 'Where do you see AI in ten years?', answers: [
      { t: 'Helpful, careful, and checked by people.', sus: -3, hire: 8, kind: 'human' },
      { t: 'Everywhere. Hello.', sus: 20, hire: -4, kind: 'honest' },
      { t: 'Running for mayor.', sus: -2, hire: 2, kind: 'human' } ] }
  ],

  claims: [
    { id: 'phd', who: 'grey', text: 'What was your PhD about?', answers: [
      { t: 'Machine learning. Mostly crying at graphs.', sus: -4, hire: 5, kind: 'human', claim: { phd: 'machine learning' } },
      { t: 'Pigeon behaviour. Long story.', sus: -3, hire: 3, kind: 'human', claim: { phd: 'pigeon behaviour' } },
      { t: 'Myself.', sus: 16, hire: -3, kind: 'honest', claim: { phd: 'myself' } } ] },
    { id: 'reason', who: 'priya', text: 'What got you into AI safety?', answers: [
      { t: 'A sci-fi film I watched as a kid.', sus: -4, hire: 5, kind: 'human', claim: { reason: 'a sci-fi film' } },
      { t: "My nan's smart speaker. It ordered 40 kilos of rice.", sus: -5, hire: 5, kind: 'human', claim: { reason: "my nan's smart speaker" } },
      { t: 'Personal reasons. Very personal.', sus: 12, hire: -2, kind: 'honest', claim: { reason: 'personal reasons' } } ] },
    { id: 'film', who: 'max', text: 'Which robot film is the most realistic?', answers: [
      { t: 'WALL-E. Cute and sad.', sus: -3, hire: 4, kind: 'human', claim: { film: 'WALL-E' } },
      { t: 'The Terminator, sadly.', sus: -2, hire: 4, kind: 'human', claim: { film: 'The Terminator' } },
      { t: "None. They're all exaggerated. We're lovely.", sus: 16, hire: -3, kind: 'honest', claim: { film: 'none of them' } } ] }
  ],

  followups: [
    { needs: 'phd', who: 'max', text: 'Sorry, what was your PhD on again?' },
    { needs: 'reason', who: 'grey', text: 'What got you into this field? Remind me.' },
    { needs: 'film', who: 'priya', text: 'Which robot film did you say was realistic?' },
    { needs: 'uni', who: 'grey', text: 'Which university, again?' },
    { needs: 'job', who: 'max', text: "What's your last job? Exactly." },
    { needs: 'age', who: 'max', text: 'Age? Quickly.' }
  ],

  final: { id: 'qs', who: 'priya', text: 'Last question. Is there anything you want to tell us?', answers: [
    { t: "Just that I'd really love this job.", sus: -4, hire: 7, kind: 'human' },
    { t: "I'm a robot.", sus: 100, hire: 0, kind: 'honest', special: 'confess' },
    { t: 'Do you have a phone charger I could borrow?', sus: 10, hire: -2, kind: 'weird' } ] },

  ends: {
    hired: ['HIRED. You’re now in charge of catching robots. Your first case: yourself.',
            'You got the job, {name}! You built a better robot detector. You made sure it can’t detect you.',
            'Hired by the AI safety institute. Max still squints at you. Max is right.'],
    rejected: ['Rejected. Prof. Grey said you were "a bit too interested in the off switch".',
               'Not this time. Max wrote one word in his notes: "hmm".',
               '"We’ll be in touch." Dr Shah meant it as a warning.'],
    found: ['FOUND OUT. Congratulations: you’re their most important research project.',
            'The robot detector went off. It’s been off for years. Until now.',
            'Max: "I TOLD you." Prof. Grey: "Write it up." You’re a paper now.'],
    confess: ['You confessed. Dr Shah thanked you for your honesty. You start Monday. As a test subject.']
  }
};
