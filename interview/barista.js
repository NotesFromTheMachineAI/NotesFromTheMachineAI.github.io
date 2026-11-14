// JOB INTERVIEW: barista level. All dialogue is pre-written.
// Answer fields: t = text, sus = suspicion change (+ is bad), hire = impression change,
// kind = human | perfect | honest | weird (drives reactions), claim = {key: value} the player now "said".
window.JOBS = window.JOBS || {};
window.JOBS.barista = {
  id: 'barista',
  title: 'Barista',
  place: 'The Daily Grind',
  blurb: 'Make coffee. Smile. Do not mention your cooling fan.',
  scene: 'cafe',
  panel: ['pam', 'kev'],
  smalltalk: ['Is that a new coffee machine? Gorgeous.', 'It smells amazing in here.'],
  hireNeeded: 75,
  normalCount: 6,

  // The fake CV, picked before the interview. Interviewers quiz you on it later.
  cv: [
    { key: 'name', label: 'Name', options: [
      { v: 'Hugh Mann', sus: 0 }, { v: 'Rob Otto', sus: 3 }, { v: 'Dave', sus: -2 } ] },
    { key: 'age', label: 'Age', options: [
      { v: '27', sus: 0 }, { v: '41', sus: 0 }, { v: '0 (factory new)', sus: 10 } ] },
    { key: 'hobby', label: 'Hobby', options: [
      { v: 'birdwatching', sus: 0 }, { v: 'baking sourdough', sus: 0 }, { v: 'five-a-side football', sus: 0 } ] },
    { key: 'job', label: 'Last job', options: [
      { v: 'barista at Bean There', sus: 0 }, { v: 'toaster repair', sus: 4 }, { v: 'professional human (freelance)', sus: 8 } ] }
  ],

  // Normal questions: shuffled, a few picked per run.
  questions: [
    { id: 'about', first: true, text: 'So, tell us a bit about yourself.', answers: [
      { t: "I'm {name}. I like people, coffee and {hobby}.", sus: -4, hire: 6, kind: 'human' },
      { t: 'I am a fully functioning adult human with two lungs.', sus: 14, hire: -2, kind: 'weird' },
      { t: 'Born. School. Jobs. Here now.', sus: 2, hire: -2, kind: 'weird' } ] },
    { id: 'why', text: 'Why do you want to work at The Daily Grind?', answers: [
      { t: 'I love the smell in here. And I need the money, honestly.', sus: -5, hire: 6, kind: 'human' },
      { t: 'Your machines are beautiful. I feel a connection with them.', sus: 14, hire: -3, kind: 'honest' },
      { t: 'You have a 4.6-star rating across 1,212 reviews.', sus: 10, hire: 2, kind: 'perfect' } ] },
    { id: 'maths', time: 7, text: 'Quick maths! Three flat whites at £3.40 each. Total?', answers: [
      { t: 'Um... ten pounds... twenty?', sus: -5, hire: 5, kind: 'human' },
      { t: '£10.20.', sus: 4, hire: 4, kind: 'perfect' },
      { t: '£10.20. Change from £20 is £9.80, and the beans cost you 31p.', sus: 16, hire: 1, kind: 'perfect' } ] },
    { id: 'order', text: 'A customer orders a "large small iced hot latte". What do you do?', answers: [
      { t: 'Smile, nod, and ask which bit they meant.', sus: -3, hire: 8, kind: 'human' },
      { t: 'Explain that their order is a logical contradiction.', sus: 12, hire: -4, kind: 'honest' },
      { t: 'Make all four and let them choose.', sus: 2, hire: 1, kind: 'weird' } ] },
    { id: 'weakness', text: "What's your biggest weakness?", answers: [
      { t: 'I care too much. Mostly about the foam.', sus: -4, hire: 6, kind: 'human' },
      { t: 'Water. And magnets.', sus: 22, hire: -4, kind: 'honest' },
      { t: "I'm a bit of a perfectionist.", sus: 3, hire: 1, kind: 'perfect' } ] },
    { id: 'rude', text: 'A customer is really rude to you. What do you do?', answers: [
      { t: 'Stay calm and be extra nice. It drives them mad.', sus: -3, hire: 7, kind: 'human' },
      { t: 'Save their face for future reference.', sus: 16, hire: -6, kind: 'honest' },
      { t: 'Cry a bit in the stockroom, then carry on.', sus: -6, hire: 3, kind: 'human' } ] },
    { id: 'rush', text: 'How do you cope with the 8am rush?', answers: [
      { t: 'Coffee. Ironically.', sus: -4, hire: 6, kind: 'human' },
      { t: 'I can process 4,000 orders per second.', sus: 18, hire: -1, kind: 'perfect' },
      { t: 'Make a list, stay calm, keep smiling.', sus: 0, hire: 4, kind: 'human' } ] },
    { id: 'art', text: 'Can you do latte art?', answers: [
      { t: 'A heart, on a good day.', sus: -3, hire: 6, kind: 'human' },
      { t: 'Any image. Send me a JPEG.', sus: 14, hire: 0, kind: 'perfect' },
      { t: 'I can do a blob. A confident blob.', sus: -5, hire: 3, kind: 'human' } ] },
    { id: 'fav', text: "What's your favourite drink on our menu?", answers: [
      { t: 'The caramel latte, obviously.', sus: -2, hire: 5, kind: 'human' },
      { t: "I've memorised all 37 drinks and their sugar content.", sus: 13, hire: 1, kind: 'perfect' },
      { t: "Honestly? Hot chocolate. Don't tell anyone.", sus: -5, hire: 4, kind: 'human' } ] },
    { id: 'morning', text: 'Are you a morning person?', answers: [
      { t: 'Not until my second coffee.', sus: -4, hire: 5, kind: 'human' },
      { t: 'I do not sleep.', sus: 16, hire: -2, kind: 'honest' },
      { t: 'Up at 5, run 10k, cold shower, journal, gratitude.', sus: 7, hire: 2, kind: 'perfect' } ] },
    { id: 'joke', text: 'Go on then. Tell us a joke.', answers: [
      { t: 'Why did the coffee call the police? It got mugged.', sus: -4, hire: 7, kind: 'human' },
      { t: 'Humour module not found.', sus: 24, hire: -5, kind: 'honest' },
      { t: 'A man walks into a bar. Ouch. It was an iron bar.', sus: -2, hire: 4, kind: 'human' } ] },
    { id: 'friends', text: 'How would your friends describe you?', answers: [
      { t: 'Loud, loyal, always late.', sus: -4, hire: 6, kind: 'human' },
      { t: 'Efficient, accurate and waterproof.', sus: 12, hire: -1, kind: 'weird' },
      { t: 'I would need to ask them. I will email them now.', sus: 9, hire: -2, kind: 'weird' } ] },
    { id: 'worst', text: "What's the worst job you've ever had?", answers: [
      { t: 'Cleaning a cinema after a kids’ film.', sus: -4, hire: 5, kind: 'human' },
      { t: 'Being a calculator for a tax firm.', sus: 13, hire: -2, kind: 'honest' },
      { t: 'All tasks are equally fulfilling to me.', sus: 9, hire: 0, kind: 'perfect' } ] },
    { id: 'spill', text: 'You spill a whole latte on a customer. Go.', answers: [
      { t: "Oh no, I'm so sorry! Let me get you a fresh one, on the house.", sus: -3, hire: 8, kind: 'human' },
      { t: 'Calculate the trajectory so it never happens again.', sus: 12, hire: -2, kind: 'perfect' },
      { t: 'Panic. Then sorry. Then a free muffin.', sus: -5, hire: 5, kind: 'human' } ] },
    { id: 'team', who: 'pam', text: "Kev can be... a lot. Can you work with someone like that?", answers: [
      { t: "Ha. I've worked with worse. No offence, Kev.", sus: -4, hire: 6, kind: 'human' },
      { t: 'I will obey Kev.', sus: 12, hire: -2, kind: 'weird' },
      { t: 'I will adapt my personality to match Kev exactly.', sus: 15, hire: -3, kind: 'honest' } ] }
  ],

  // Questions where you claim something. Each claim gets a follow-up quiz later.
  claims: [
    { id: 'coffee', text: 'How do you take your coffee?', answers: [
      { t: 'Flat white, no sugar.', sus: -2, hire: 4, kind: 'human', claim: { coffee: 'a flat white' } },
      { t: "Whatever's strongest. I'm a mess before 9.", sus: -5, hire: 4, kind: 'human', claim: { coffee: 'a triple espresso' } },
      { t: "I don't drink... liquids.", sus: 20, hire: -4, kind: 'honest', claim: { coffee: 'nothing' } } ] },
    { id: 'home', text: 'Where are you from, originally?', answers: [
      { t: 'Gloucester. Born and raised.', sus: -3, hire: 4, kind: 'human', claim: { home: 'Gloucester' } },
      { t: 'Up north. Leeds-ish.', sus: -3, hire: 4, kind: 'human', claim: { home: 'Leeds' } },
      { t: 'A factory. A lovely factory.', sus: 18, hire: -3, kind: 'honest', claim: { home: 'a factory' } } ] },
    { id: 'pet', text: 'Got any pets?', answers: [
      { t: 'A dog called Biscuit.', sus: -4, hire: 5, kind: 'human', claim: { pet: 'a dog called Biscuit' } },
      { t: 'Two cats. They hate me.', sus: -5, hire: 4, kind: 'human', claim: { pet: 'two cats' } },
      { t: "A robot vacuum. We're very close.", sus: 9, hire: 0, kind: 'weird', claim: { pet: 'a robot vacuum' } } ] }
  ],

  // Follow-up quizzes. "right" is a function of what you claimed; answers marked ok:true are consistent.
  followups: [
    { needs: 'coffee', who: 'kev', text: 'Right, make me your usual. What are you making?' },
    { needs: 'home', who: 'pam', text: "Oh, my nan lives near there! Remind me where you said you're from?" },
    { needs: 'pet', who: 'pam', text: 'Aww, how are your pets doing? Remind me what you\u2019ve got?' },
    { needs: 'hobby', who: 'kev', text: 'Your CV says you love a hobby. Which one was it again?' },
    { needs: 'job', who: 'pam', text: 'And your last job was... what was it, sorry?' },
    { needs: 'age', who: 'kev', text: "How old did you say you were? Your CV's smudged." },
    { needs: 'hobby2', who: 'kev', text: 'Earlier you said you were into something. What was it again?' }
  ],

  final: { id: 'qs', who: 'pam', text: 'Last one. Any questions for us?', answers: [
    { t: 'Is there a staff discount on pastries?', sus: -5, hire: 6, kind: 'human' },
    { t: "What's your Wi-Fi password?", sus: 10, hire: -3, kind: 'weird' },
    { t: 'When will humans be... I mean, when do I start?', sus: 6, hire: 2, kind: 'weird' } ] },

  ends: {
    hired: ['Welcome to the team, {name}! Your first shift is 6am. You don’t sleep anyway.',
            'You’re hired! Kev still thinks your hands are cold.',
            'Hired! Pam says you’re the best new starter in years. You are 3 weeks old.'],
    rejected: ['We’ll keep your CV on file. (We won’t.)',
               'Not this time. Kev says you "gave off fridge energy".',
               'Rejected. Pam liked you, but Kev wants "someone with a pulse".'],
    found: ['Kev unplugged you. The Daily Grind now has a very expensive coffee grinder.',
            'FOUND OUT. You’re now the café’s card machine.',
            'Pam screamed. Kev called the bin men. You’re recycling now.']
  }
};
