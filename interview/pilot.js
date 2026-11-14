// JOB INTERVIEW: airline pilot. Please don't mention autopilot.
window.JOBS = window.JOBS || {};
window.JOBS.pilot = {
  id: 'pilot',
  title: 'Pilot',
  place: 'Skyward Airways',
  scene: 'airline',
  panel: ['hargreaves', 'lin'],
  hireNeeded: 80,
  normalCount: 6,
  time: 11,
  smalltalk: ['Lovely view of the runway.', 'Great hat, Captain.'],

  cv: [
    { key: 'name', label: 'Name', options: [{ v: 'Hugh Mann', sus: 0 }, { v: 'Captain Sky', sus: 3 }, { v: 'Dave', sus: -2 }] },
    { key: 'age', label: 'Age', options: [{ v: '31', sus: 0 }, { v: '47', sus: 0 }, { v: '0 (factory new)', sus: 10 }] },
    { key: 'hours', label: 'Flying hours', options: [{ v: '1,200 hours', sus: 0 }, { v: '3 hours on a simulator', sus: 4 }, { v: '10 million hours of uptime', sus: 12 }] },
    { key: 'job', label: 'Last job', options: [{ v: 'flying instructor', sus: 0 }, { v: 'air steward', sus: 0 }, { v: 'sat-nav', sus: 12 }] }
  ],

  questions: [
    { id: 'about', first: true, who: 'hargreaves', text: 'Captain Hargreaves. Tell me about yourself. Briefly.', answers: [
      { t: "I'm {name}. I've wanted to fly since I was little.", sus: -4, hire: 7, kind: 'human' },
      { t: 'I already have wings. Sort of. Ignore that.', sus: 14, hire: -3, kind: 'honest' },
      { t: 'Calm. Precise. Never tired.', sus: 9, hire: 1, kind: 'perfect' } ] },
    { id: 'engine', who: 'hargreaves', text: 'Engine failure on take-off. What do you do?', answers: [
      { t: 'Stay calm, fly the plane, run the checklist.', sus: -3, hire: 9, kind: 'human' },
      { t: 'Switch to my backup battery.', sus: 16, hire: -4, kind: 'honest' },
      { t: 'Panic. But quietly.', sus: -2, hire: -4, kind: 'human' } ] },
    { id: 'turb', who: 'hargreaves', text: 'Heavy turbulence. Talk me through it.', answers: [
      { t: 'Seatbelt signs on, calm voice, slow down.', sus: -3, hire: 8, kind: 'human' },
      { t: 'I enjoy it. It tickles my wires.', sus: 16, hire: -3, kind: 'honest' },
      { t: 'I can predict it four minutes ahead.', sus: 12, hire: 0, kind: 'perfect' } ] },
    { id: 'nervous', who: 'lin', text: 'A passenger is terrified of flying. What do you say?', answers: [
      { t: "You're in good hands. Have a biscuit.", sus: -4, hire: 8, kind: 'human' },
      { t: 'Statistically, vending machines are more dangerous.', sus: 10, hire: -4, kind: 'perfect' },
      { t: 'Fear is just a setting. Turn it off.', sus: 15, hire: -3, kind: 'honest' } ] },
    { id: 'awake', who: 'lin', text: 'How do you stay awake on a 14-hour flight?', answers: [
      { t: 'Coffee, and chatting to the co-pilot.', sus: -4, hire: 6, kind: 'human' },
      { t: 'I go into low-power mode.', sus: 16, hire: -3, kind: 'honest' },
      { t: "I don't sleep. Ever.", sus: 14, hire: -2, kind: 'honest' } ] },
    { id: 'autopilot', who: 'hargreaves', text: "What's autopilot?", answers: [
      { t: 'It helps fly the plane, but the pilot is always in charge.', sus: -3, hire: 8, kind: 'human' },
      { t: 'My cousin.', sus: 22, hire: -4, kind: 'honest' },
      { t: 'A close personal friend.', sus: 12, hire: -2, kind: 'weird' } ] },
    { id: 'bird', who: 'hargreaves', text: 'Bird strike! Go!', answers: [
      { t: 'Check the engines, tell air traffic control, land.', sus: -3, hire: 8, kind: 'human' },
      { t: 'Negotiate with the bird.', sus: 8, hire: -4, kind: 'weird' },
      { t: 'The bird was doing 12 metres per second. I saw it.', sus: 12, hire: -1, kind: 'perfect' } ] },
    { id: 'announce', who: 'lin', text: 'Give us a cabin announcement. Go.', answers: [
      { t: 'Good afternoon, this is your captain. Sit back and enjoy the flight.', sus: -4, hire: 8, kind: 'human' },
      { t: 'ATTENTION HUMANS. REMAIN SEATED.', sus: 20, hire: -5, kind: 'honest' },
      { t: 'Um, hello? Is this on? Hi!', sus: -4, hire: 2, kind: 'human' } ] },
    { id: 'jetlag', who: 'lin', text: 'Do you get jet lag?', answers: [
      { t: "Terribly. I'm a zombie for two days.", sus: -5, hire: 5, kind: 'human' },
      { t: 'I just change my clock.', sus: 15, hire: -2, kind: 'honest' },
      { t: 'What is jet lag?', sus: 9, hire: -2, kind: 'weird' } ] },
    { id: 'asleep', who: 'hargreaves', text: 'Your co-pilot falls asleep. What do you do?', answers: [
      { t: 'Let them nap, wake them for landing.', sus: -3, hire: 6, kind: 'human' },
      { t: 'Draw a moustache on them.', sus: -2, hire: -3, kind: 'human' },
      { t: "Fly alone. I don't need a co-pilot.", sus: 13, hire: -3, kind: 'perfect' } ] },
    { id: 'fav', who: 'hargreaves', text: 'Favourite plane?', answers: [
      { t: 'The Spitfire. Beautiful thing.', sus: -4, hire: 6, kind: 'human' },
      { t: 'The 747-400. 416 seats, top speed 988 km/h.', sus: 11, hire: 1, kind: 'perfect' },
      { t: 'Any plane that lands.', sus: -4, hire: 4, kind: 'human' } ] },
    { id: 'meal', who: 'lin', text: 'Inflight meal: chicken or pasta?', answers: [
      { t: 'Pasta, every time.', sus: -4, hire: 5, kind: 'human' },
      { t: 'Neither. I run on electricity.', sus: 20, hire: -4, kind: 'honest' },
      { t: "Both. I'm the captain.", sus: -3, hire: 4, kind: 'human' } ] },
    { id: 'three', who: 'lin', text: 'Describe yourself in three words.', answers: [
      { t: 'Calm, careful, funny.', sus: -3, hire: 7, kind: 'human' },
      { t: 'Metal. Mostly metal.', sus: 20, hire: -4, kind: 'honest' },
      { t: 'Precise, punctual, perfect.', sus: 11, hire: 0, kind: 'perfect' } ] },
    { id: 'fear', who: 'lin', text: "What's your biggest fear?", answers: [
      { t: 'Spiders. Big ones.', sus: -4, hire: 5, kind: 'human' },
      { t: 'Water. And magnets. And being unplugged.', sus: 20, hire: -4, kind: 'honest' },
      { t: "I don't have fears. I have error codes.", sus: 16, hire: -3, kind: 'honest' } ] },
    { id: 'landing', who: 'hargreaves', text: 'Rate your landings out of ten.', answers: [
      { t: 'Seven. Eight on a good day.', sus: -4, hire: 6, kind: 'human' },
      { t: 'Ten. Every time. To the millimetre.', sus: 12, hire: 0, kind: 'perfect' },
      { t: 'Do the passengers clap? Then ten.', sus: -2, hire: 4, kind: 'human' } ] }
  ],

  claims: [
    { id: 'school', who: 'hargreaves', text: 'Where did you train?', answers: [
      { t: 'Oxford Aviation Academy.', sus: -2, hire: 5, kind: 'human', claim: { school: 'Oxford Aviation Academy' } },
      { t: 'A flight simulator. In my bedroom.', sus: 4, hire: -2, kind: 'human', claim: { school: 'a simulator in my bedroom' } },
      { t: 'The Boeing factory.', sus: 18, hire: -4, kind: 'honest', claim: { school: 'the Boeing factory' } } ] },
    { id: 'callsign', who: 'lin', text: 'Every pilot has a nickname. What’s yours?', answers: [
      { t: 'Maverick. Obviously.', sus: -3, hire: 4, kind: 'human', claim: { callsign: 'Maverick' } },
      { t: 'Biscuit. Long story.', sus: -5, hire: 4, kind: 'human', claim: { callsign: 'Biscuit' } },
      { t: 'Model T-800.', sus: 18, hire: -4, kind: 'honest', claim: { callsign: 'Model T-800' } } ] },
    { id: 'emergency', who: 'hargreaves', text: 'Ever done an emergency landing?', answers: [
      { t: 'Once, in Malaga. Hydraulics.', sus: -3, hire: 6, kind: 'human', claim: { emergency: 'once, in Malaga' } },
      { t: "Never, thankfully.", sus: -2, hire: 3, kind: 'human', claim: { emergency: 'never' } },
      { t: 'I am the emergency.', sus: 14, hire: -4, kind: 'weird', claim: { emergency: 'I am the emergency' } } ] }
  ],

  followups: [
    { needs: 'school', who: 'hargreaves', text: 'Remind me where you trained.' },
    { needs: 'callsign', who: 'lin', text: 'And your nickname was...?' },
    { needs: 'emergency', who: 'hargreaves', text: 'Your emergency landing. Where was that again?' },
    { needs: 'hours', who: 'hargreaves', text: 'How many flying hours did you put down?' },
    { needs: 'job', who: 'lin', text: 'What was your last job, again?' },
    { needs: 'age', who: 'lin', text: 'And your age? For the medical.' }
  ],

  final: { id: 'qs', who: 'hargreaves', text: 'Any questions for us?', answers: [
    { t: 'Do I get the hat?', sus: -5, hire: 7, kind: 'human' },
    { t: 'Which one is the eject button?', sus: 8, hire: -3, kind: 'weird' },
    { t: 'Can I connect to the plane over Wi-Fi?', sus: 14, hire: -3, kind: 'honest' } ] },

  ends: {
    hired: ['Hired! You got the hat. Captain {name}, cleared for take-off.',
            'You’re a pilot! The passengers love you. They have no idea.',
            'Hired! Dr Lin still thinks you’re "a bit too calm". You are.'],
    rejected: ['Rejected. Captain Hargreaves said you "flew a bit too smoothly".',
               '"Grounded." Dr Lin’s notes just say "???".',
               'Not this time. They went with someone who gets jet lag.'],
    found: ['FOUND OUT. You’re now the in-flight entertainment system.',
            'Dr Lin pressed a button. You powered down. You’re being checked in as luggage.',
            'Captain Hargreaves radioed the tower: "We’ve got a robot." The tower said "Again?"']
  }
};
