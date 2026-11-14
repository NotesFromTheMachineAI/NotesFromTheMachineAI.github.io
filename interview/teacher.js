// JOB INTERVIEW: primary school teacher. Three interviewers, and one of them is seven.
window.JOBS = window.JOBS || {};
window.JOBS.teacher = {
  id: 'teacher',
  title: 'Teacher',
  place: 'Oakwood Primary',
  scene: 'school',
  panel: ['okafor', 'pringle', 'alfie'],
  hireNeeded: 78,
  normalCount: 6,
  time: 12,
  smalltalk: ['Love the bunting!', 'Is that a real hamster in the corner?'],

  cv: [
    { key: 'name', label: 'Name', options: [{ v: 'Hugh Mann', sus: 0 }, { v: 'Miss Tress', sus: 2 }, { v: 'Dave', sus: -2 }] },
    { key: 'age', label: 'Age', options: [{ v: '29', sus: 0 }, { v: '44', sus: 0 }, { v: '0 (factory new)', sus: 10 }] },
    { key: 'degree', label: 'Qualification', options: [{ v: 'a teaching degree', sus: 0 }, { v: 'a YouTube crash course', sus: 4 }, { v: 'downloaded overnight', sus: 12 }] },
    { key: 'job', label: 'Last job', options: [{ v: 'teaching assistant', sus: 0 }, { v: "children's entertainer", sus: 2 }, { v: 'calculator', sus: 12 }] }
  ],

  questions: [
    { id: 'about', first: true, who: 'okafor', text: 'Welcome to Oakwood! Tell us a little about yourself.', answers: [
      { t: "I'm {name}. I love kids, crafts and terrible jokes.", sus: -4, hire: 7, kind: 'human' },
      { t: 'I am a qualified human adult with a heartbeat.', sus: 14, hire: -3, kind: 'weird' },
      { t: 'I have read every book. Every single one.', sus: 12, hire: 0, kind: 'perfect' } ] },
    { id: 'sky', who: 'alfie', text: 'Why is the sky blue?', answers: [
      { t: "Ooh, great question! Let's find out together.", sus: -4, hire: 8, kind: 'human' },
      { t: 'Rayleigh scattering of short-wavelength sunlight.', sus: 12, hire: -1, kind: 'perfect' },
      { t: 'Because blue is the default setting.', sus: 14, hire: -3, kind: 'honest' } ] },
    { id: 'dino', who: 'alfie', text: "What's your favourite dinosaur?", answers: [
      { t: 'T. rex. Obviously.', sus: -4, hire: 6, kind: 'human' },
      { t: 'Velociraptor. They were actually the size of a turkey.', sus: 4, hire: 3, kind: 'perfect' },
      { t: 'I do not know dinosaurs. They were before my time.', sus: 10, hire: -2, kind: 'weird' } ] },
    { id: 'talker', who: 'okafor', text: "A child won't stop talking during the lesson. What do you do?", answers: [
      { t: 'Give them a job, like handing out the books.', sus: -3, hire: 8, kind: 'human' },
      { t: 'Mute them.', sus: 18, hire: -6, kind: 'honest' },
      { t: 'Talk louder than them.', sus: -1, hire: -2, kind: 'human' } ] },
    { id: 'glue', who: 'pringle', text: 'Two children are fighting over a glue stick. Go.', answers: [
      { t: 'Find a second glue stick. Crisis over.', sus: -4, hire: 7, kind: 'human' },
      { t: 'Glue sticks cost 89p. I will order 400.', sus: 11, hire: 0, kind: 'perfect' },
      { t: 'Take the glue stick and hold it high. Forever.', sus: 5, hire: -3, kind: 'weird' } ] },
    { id: 'robot', who: 'alfie', text: 'Are you a robot?', answers: [
      { t: 'Ha! No. Are YOU a robot?', sus: -6, hire: 6, kind: 'human' },
      { t: '...No.', sus: 9, hire: -1, kind: 'weird' },
      { t: 'Beep boop! Just kidding. Unless...?', sus: 2, hire: 5, kind: 'human' } ] },
    { id: 'maths', who: 'pringle', text: 'How would you make maths fun?', answers: [
      { t: 'Counting sweets. Then eating them.', sus: -4, hire: 7, kind: 'human' },
      { t: 'Maths is already fun. I do it all day.', sus: 12, hire: -1, kind: 'honest' },
      { t: 'A times tables rap. I have one ready.', sus: -2, hire: 5, kind: 'human' } ] },
    { id: 'rain', who: 'okafor', text: "It's raining at playtime. What's the plan?", answers: [
      { t: 'Indoor games and a film.', sus: -3, hire: 6, kind: 'human' },
      { t: 'Rain is dangerous. We stay inside. Forever.', sus: 14, hire: -3, kind: 'honest' },
      { t: 'Wellies on. Puddle jumping.', sus: -4, hire: 3, kind: 'human' } ] },
    { id: 'tooth', who: 'okafor', text: 'A child is crying because their tooth fell out. Help!', answers: [
      { t: 'Wrap it up for the tooth fairy!', sus: -4, hire: 8, kind: 'human' },
      { t: 'Teeth are replaceable parts. Order a new one.', sus: 16, hire: -5, kind: 'honest' },
      { t: 'Put it back in.', sus: 6, hire: -4, kind: 'weird' } ] },
    { id: 'genius', who: 'pringle', text: 'A parent insists their son is a genius. Is he?', answers: [
      { t: "He's brilliant at lots of things!", sus: -3, hire: 7, kind: 'human' },
      { t: 'No. He is in the 52nd percentile.', sus: 12, hire: -4, kind: 'perfect' },
      { t: "Aren't we all?", sus: -2, hire: 3, kind: 'human' } ] },
    { id: 'cartwheel', who: 'alfie', text: 'Can you do a cartwheel?', answers: [
      { t: 'Not since about 1998.', sus: -5, hire: 5, kind: 'human' },
      { t: 'My joints rotate 360 degrees.', sus: 18, hire: -2, kind: 'honest' },
      { t: 'Watch this... no. Not today.', sus: -3, hire: 4, kind: 'human' } ] },
    { id: 'glitter', who: 'pringle', text: 'How do you feel about glitter?', answers: [
      { t: 'Love it. Hate the clean-up.', sus: -4, hire: 6, kind: 'human' },
      { t: 'It gets in my vents.', sus: 16, hire: -2, kind: 'honest' },
      { t: "There are 4.2 million bits in one pot. I've counted.", sus: 12, hire: -1, kind: 'perfect' } ] },
    { id: 'rule', who: 'okafor', text: "What's classroom rule number one?", answers: [
      { t: 'Be kind.', sus: -3, hire: 8, kind: 'human' },
      { t: 'Obey.', sus: 18, hire: -6, kind: 'honest' },
      { t: 'No running with scissors.', sus: -2, hire: 4, kind: 'human' } ] },
    { id: 'story', who: 'alfie', text: "What's the best story for story time?", answers: [
      { t: 'The Gruffalo. With all the voices.', sus: -5, hire: 7, kind: 'human' },
      { t: 'The owner’s manual for a Toyota Corolla.', sus: 12, hire: -3, kind: 'weird' },
      { t: "Whatever you pick, even for the 40th time.", sus: -3, hire: 5, kind: 'human' } ] },
    { id: 'phone', who: 'pringle', text: 'Phones in the classroom: yes or no?', answers: [
      { t: 'No. Unless I need to call the office.', sus: -3, hire: 6, kind: 'human' },
      { t: "No. They're my cousins. It's awkward.", sus: 15, hire: -3, kind: 'honest' },
      { t: 'Only for showing videos of cats.', sus: -2, hire: 3, kind: 'human' } ] }
  ],

  claims: [
    { id: 'pet', who: 'alfie', text: 'Have you got a pet?', answers: [
      { t: 'A hamster called Gary.', sus: -5, hire: 5, kind: 'human', claim: { pet: 'a hamster called Gary' } },
      { t: 'A goldfish. He does nothing.', sus: -4, hire: 4, kind: 'human', claim: { pet: 'a goldfish' } },
      { t: 'A printer. It jams when it’s happy.', sus: 10, hire: -2, kind: 'weird', claim: { pet: 'a printer' } } ] },
    { id: 'lunch', who: 'alfie', text: 'What did you have for lunch?', answers: [
      { t: 'A cheese sandwich.', sus: -4, hire: 4, kind: 'human', claim: { lunch: 'a cheese sandwich' } },
      { t: 'Tomato soup.', sus: -3, hire: 4, kind: 'human', claim: { lunch: 'tomato soup' } },
      { t: 'A USB stick.', sus: 18, hire: -4, kind: 'honest', claim: { lunch: 'a USB stick' } } ] },
    { id: 'subject', who: 'okafor', text: 'Which subject do you love teaching most?', answers: [
      { t: 'Art. Messy, but worth it.', sus: -4, hire: 5, kind: 'human', claim: { subject: 'art' } },
      { t: 'PE. I love a parachute game.', sus: -3, hire: 5, kind: 'human', claim: { subject: 'PE' } },
      { t: 'Binary.', sus: 14, hire: -3, kind: 'honest', claim: { subject: 'binary' } } ] }
  ],

  followups: [
    { needs: 'pet', who: 'alfie', text: "What's your pet again? I forgot." },
    { needs: 'lunch', who: 'alfie', text: 'What did you say you had for lunch?' },
    { needs: 'subject', who: 'pringle', text: 'Remind me, which subject was your favourite?' },
    { needs: 'degree', who: 'pringle', text: 'Your qualification. Remind me what it was?' },
    { needs: 'job', who: 'okafor', text: 'And your last job? Sorry, my notes are covered in glitter.' },
    { needs: 'age', who: 'alfie', text: 'How old are you? Are you older than my nan?' }
  ],

  final: { id: 'qs', who: 'alfie', text: 'Last question is from me. Will you be my friend?', answers: [
    { t: 'Of course I will!', sus: -5, hire: 7, kind: 'human' },
    { t: 'Friendship request accepted.', sus: 14, hire: -2, kind: 'honest' },
    { t: 'If you sit nicely on the carpet.', sus: -3, hire: 4, kind: 'human' } ] },

  ends: {
    hired: ['Hired! Alfie made you a card. It says "BEST TEECHER". You’ve laminated it.',
            'You got the job, {name}! 30 children. 0 suspicions. 1 laminator.',
            'Hired! Mr Pringle still watches you at lunch. You still don’t eat it.'],
    rejected: ['Rejected. Mr Pringle wrote "too shiny" in his notes.',
               '"We’ll keep your details on file." Alfie cried. You didn’t. Suspicious.',
               'Not this time. They hired someone who can do a cartwheel.'],
    found: ['Alfie shouted "ROBOT!" and the whole school came to look. You’re now the class computer.',
            'FOUND OUT. You’re in the school science fair now. You came third.',
            'Mrs Okafor screamed. Mr Pringle said "I KNEW it". Alfie asked if he could keep you.']
  }
};
