// JOB INTERVIEW: lifeguard level. One interviewer, and you are not waterproof.
window.JOBS = window.JOBS || {};
window.JOBS.lifeguard = {
  id: 'lifeguard',
  title: 'Lifeguard',
  place: 'Splashworld Leisure Centre',
  scene: 'pool',
  panel: ['shaz'],
  hireNeeded: 75,
  normalCount: 6,
  time: 12,
  smalltalk: ['Love the smell of chlorine. Very... clean.', 'Is that a new diving board? Fancy.'],

  cv: [
    { key: 'name', label: 'Name', options: [{ v: 'Hugh Mann', sus: 0 }, { v: 'Splash McGee', sus: 4 }, { v: 'Dave', sus: -2 }] },
    { key: 'age', label: 'Age', options: [{ v: '23', sus: 0 }, { v: '38', sus: 0 }, { v: '0 (factory new)', sus: 10 }] },
    { key: 'badge', label: 'Swimming level', options: [{ v: 'my 25 metre badge', sus: 0 }, { v: 'county champion', sus: 2 }, { v: 'I sink, but confidently', sus: 10 }] },
    { key: 'job', label: 'Last job', options: [{ v: 'swimming teacher', sus: 0 }, { v: 'car wash', sus: 3 }, { v: 'submarine (as a part)', sus: 12 }] }
  ],

  questions: [
    { id: 'about', first: true, text: "Right. Tell me about yourself. Quickly, I've got a pool to watch.", answers: [
      { t: "I'm {name}. I love swimming, people, and that tall chair.", sus: -4, hire: 6, kind: 'human' },
      { t: 'I am fully waterproof. Mostly. Partly.', sus: 15, hire: -3, kind: 'honest' },
      { t: 'I like water. From a safe distance.', sus: 4, hire: -2, kind: 'weird' } ] },
    { id: 'swim', text: 'Can you actually swim?', answers: [
      { t: 'Yes! Well, a very strong doggy paddle.', sus: -5, hire: 4, kind: 'human' },
      { t: 'I sink at 2.3 metres per second.', sus: 20, hire: -6, kind: 'honest' },
      { t: 'Swimming is just falling forwards in water.', sus: 6, hire: -2, kind: 'weird' } ] },
    { id: 'deep', text: "Someone's struggling in the deep end. Go.", answers: [
      { t: 'Whistle, throw the float, get in if I have to.', sus: -3, hire: 8, kind: 'human' },
      { t: 'Calculate their buoyancy first.', sus: 12, hire: -4, kind: 'perfect' },
      { t: 'Shout "SWIM BETTER".', sus: 4, hire: -6, kind: 'weird' } ] },
    { id: 'wet', text: 'How do you feel about getting wet?', answers: [
      { t: 'Love it. Wrinkly fingers are my thing.', sus: -5, hire: 5, kind: 'human' },
      { t: 'I would prefer to stay dry. Forever.', sus: 14, hire: -4, kind: 'honest' },
      { t: 'Wet outside is fine. Wet inside is not.', sus: 16, hire: -3, kind: 'honest' } ] },
    { id: 'running', text: 'A kid is running by the pool. What do you do?', answers: [
      { t: 'Big whistle. "WALK, PLEASE!"', sus: -4, hire: 7, kind: 'human' },
      { t: 'Log the violation in my database.', sus: 12, hire: -2, kind: 'perfect' },
      { t: 'Run after them. Faster.', sus: 2, hire: -3, kind: 'weird' } ] },
    { id: 'cpr', text: 'Can you do CPR?', answers: [
      { t: 'Yes, I did the course last year.', sus: -3, hire: 7, kind: 'human' },
      { t: 'Yes. I can also jump-start your car.', sus: 12, hire: -2, kind: 'honest' },
      { t: '30 pushes, 2 breaths, 100 to 120 a minute, 5 to 6 cm deep.', sus: 9, hire: 4, kind: 'perfect' } ] },
    { id: 'breath', text: 'How long can you hold your breath?', answers: [
      { t: "About 40 seconds? I've never timed it.", sus: -4, hire: 5, kind: 'human' },
      { t: 'Indefinitely.', sus: 18, hire: -3, kind: 'honest' },
      { t: 'Hold my... what?', sus: 10, hire: -3, kind: 'weird' } ] },
    { id: 'why', text: 'Why do you want to be a lifeguard?', answers: [
      { t: 'I like keeping people safe. And the chair is very tall.', sus: -4, hire: 7, kind: 'human' },
      { t: 'To face my greatest fear: water.', sus: 9, hire: -2, kind: 'honest' },
      { t: 'The money, honestly.', sus: -2, hire: 1, kind: 'human' } ] },
    { id: 'suncream', text: "Outdoor pool in summer. Sun cream?", answers: [
      { t: 'Factor 50, every time.', sus: -3, hire: 5, kind: 'human' },
      { t: 'My casing is UV-resistant.', sus: 16, hire: -2, kind: 'honest' },
      { t: 'I just turn my brightness down.', sus: 11, hire: -2, kind: 'weird' } ] },
    { id: 'important', text: "What's the most important thing at a pool?", answers: [
      { t: 'Everyone goes home safe.', sus: -3, hire: 8, kind: 'human' },
      { t: 'The pH level, which is 7.4 right now.', sus: 12, hire: 1, kind: 'perfect' },
      { t: 'The snack machine.', sus: -5, hire: 2, kind: 'human' } ] },
    { id: 'loo', text: "It's packed and you need the loo. What do you do?", answers: [
      { t: 'Radio for cover, then go.', sus: -3, hire: 7, kind: 'human' },
      { t: 'I do not need the loo.', sus: 14, hire: -1, kind: 'honest' },
      { t: 'Hold it for three hours. Professional.', sus: -2, hire: 2, kind: 'human' } ] },
    { id: 'drain', text: "There's hair in the drain. Who cleans it?", answers: [
      { t: 'Me, sadly. Gloves on.', sus: -4, hire: 6, kind: 'human' },
      { t: 'I can extend my arm two metres.', sus: 18, hire: -2, kind: 'honest' },
      { t: "I'll ask the pool vacuum. We're close.", sus: 9, hire: -2, kind: 'weird' } ] },
    { id: 'cold', text: "A parent says the water's too cold. What do you say?", answers: [
      { t: "It's 28 degrees, but I'll mention it to the manager.", sus: -3, hire: 7, kind: 'human' },
      { t: 'It is 28.0 degrees. Exactly. Always.', sus: 11, hire: -1, kind: 'perfect' },
      { t: 'Then get out.', sus: 3, hire: -6, kind: 'weird' } ] },
    { id: 'stroke', text: 'Favourite swimming stroke?', answers: [
      { t: "Breaststroke. Slow, but I get there.", sus: -4, hire: 5, kind: 'human' },
      { t: 'None. I walk along the bottom.', sus: 18, hire: -3, kind: 'honest' },
      { t: "Butterfly. I'm a show-off.", sus: -3, hire: 4, kind: 'human' } ] },
    { id: 'bag', text: "What's in your bag right now?", answers: [
      { t: 'Towel, goggles, half a sandwich.', sus: -4, hire: 5, kind: 'human' },
      { t: 'A towel and some spare fuses.', sus: 12, hire: -1, kind: 'honest' },
      { t: 'I have no bag. Or needs.', sus: 9, hire: -2, kind: 'weird' } ] }
  ],

  claims: [
    { id: 'spot', text: 'Where do you usually swim?', answers: [
      { t: 'The leisure centre, Tuesday nights.', sus: -3, hire: 4, kind: 'human', claim: { spot: 'the leisure centre' } },
      { t: 'The sea at Weston. Brrr.', sus: -4, hire: 4, kind: 'human', claim: { spot: 'the sea at Weston' } },
      { t: 'In the bath. With supervision.', sus: 10, hire: -3, kind: 'weird', claim: { spot: 'the bath' } } ] },
    { id: 'saved', text: 'Ever saved anyone before?', answers: [
      { t: 'A kid on holiday in Spain. Scary.', sus: -3, hire: 6, kind: 'human', claim: { saved: 'a kid in Spain' } },
      { t: 'My uncle at a barbecue. He choked on a sausage.', sus: -5, hire: 4, kind: 'human', claim: { saved: 'my uncle at a barbecue' } },
      { t: 'A phone. From a toilet.', sus: 4, hire: -1, kind: 'weird', claim: { saved: 'a phone from a toilet' } } ] },
    { id: 'snack', text: 'Best post-swim snack?', answers: [
      { t: 'Hot chocolate from the machine.', sus: -4, hire: 4, kind: 'human', claim: { snack: 'a hot chocolate' } },
      { t: 'Salt and vinegar crisps.', sus: -3, hire: 4, kind: 'human', claim: { snack: 'crisps' } },
      { t: 'A nine-volt battery. Tingly.', sus: 18, hire: -4, kind: 'honest', claim: { snack: 'a nine-volt battery' } } ] }
  ],

  followups: [
    { needs: 'spot', who: 'shaz', text: 'Where did you say you usually swim?' },
    { needs: 'saved', who: 'shaz', text: 'Tell me again: who did you save?' },
    { needs: 'snack', who: 'shaz', text: "I'm going to the café. What was your snack, again?" },
    { needs: 'badge', who: 'shaz', text: "What swimming level did you put on your CV?" },
    { needs: 'job', who: 'shaz', text: 'And your last job was...?' },
    { needs: 'age', who: 'shaz', text: 'How old are you? I need it for the form.' }
  ],

  final: { id: 'qs', who: 'shaz', text: 'Last thing. Any questions for me?', answers: [
    { t: 'Do I get my own whistle?', sus: -5, hire: 6, kind: 'human' },
    { t: 'How deep is the deep end? Exactly? For no reason.', sus: 8, hire: -1, kind: 'weird' },
    { t: 'Is the tall chair waterproof? Asking for me.', sus: 10, hire: -2, kind: 'honest' } ] },

  ends: {
    hired: ['Hired! Shaz gave you a whistle. You’ll never go near the water.',
            'You got the job, {name}. Please never actually swim.',
            'Hired! You’re the best lifeguard Splashworld has had. You watch the pool for 14 hours without blinking.'],
    rejected: ['"We’ve gone with someone who floats." Rejected.',
               'Rejected. Shaz said you looked "nervous near the shallow end".',
               'Not this time. Splashworld wants someone who can get wet.'],
    found: ['Shaz pushed you in the pool to check. You’re now a very expensive drain cover.',
            'FOUND OUT. You fizzed. The pool is closed for the afternoon.',
            'Shaz blew her whistle so hard your circuits rattled. Off you go.']
  }
};
