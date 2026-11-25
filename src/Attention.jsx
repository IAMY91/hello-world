import React from 'react';
import {AbsoluteFill, Audio, Composition, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {gsap} from 'gsap';
import timing from '../public/attention/timeline.json';
import catalog from '../data/patterns.json';
import './attention.css';

const {fps, duration, scenes} = timing;
const teal = '#13CFC6';
const gold = '#F0C75D';
const motifs = [
  'M38 104 C132 8 220 18 311 63 C387 100 445 160 548 120',
  'M43 164 C127 82 224 79 313 112 C400 143 452 173 548 139',
  'M63 223 C156 146 225 137 307 155 C399 174 453 190 548 158',
];
const attention = catalog.families.find(({name}) => name === 'Attention');
const patternDescriptions = {
  'Protected Focus': 'Make room for demanding work.',
  'Fit the Challenge': 'Adjust the task or the support.',
  'Feedback Within Reach': 'Make correction possible sooner.',
  'Keep Useful Friction': 'Preserve the checks that matter.',
};

const progress = (frame, start, length) => Math.max(0, Math.min(1, (frame - start) / length));

function buildIconMotion() {
  const state = {one: 0, two: 0, three: 0, point: 0, ring: 0};
  const timeline = gsap.timeline({paused: true, defaults: {ease: 'power2.out'}});
  timeline.to(state, {one: 1, duration: 1.2}, 0.15)
    .to(state, {two: 1, duration: 1.2}, 0.36)
    .to(state, {three: 1, duration: 1.2}, 0.57)
    .to(state, {point: 1, duration: 0.48, ease: 'back.out(1.45)'}, 1.55)
    .to(state, {ring: 1, duration: 0.7}, 1.6);
  const frames = Array.from({length: 72}, (_, index) => {
    timeline.totalTime(index / fps, true);
    return {one: state.one, two: state.two, three: state.three, point: state.point, ring: state.ring};
  });
  timeline.kill();
  return frames;
}

const iconMotion = buildIconMotion();

function Icon({frame}) {
  const {one, two, three, ring, point} = iconMotion[Math.min(frame, iconMotion.length - 1)];
  return <svg viewBox="0 0 650 264" className="att-mark" role="img"
    aria-label="Three turquoise currents converge on a gold point">
    <defs>
      <linearGradient id="att-strand">
        <stop stopColor={teal} stopOpacity=".42"/>
        <stop offset=".32" stopColor={teal}/>
        <stop offset="1" stopColor="#59ede3"/>
      </linearGradient>
    </defs>
    <circle cx="584" cy="140" r={43 + 8 * Math.sin(frame / 15) ** 2} fill="none" stroke={gold}
      strokeWidth="1.4" opacity={0.16 * ring}/>
    <circle cx="584" cy="140" r="38" fill="#063238" stroke={gold}
      strokeWidth="5" pathLength="1" strokeDasharray="1 1" strokeDashoffset={1 - ring}
      transform="rotate(-90 584 140)" opacity={ring}/>
    {motifs.map((path, index) => <path key={path} d={path} fill="none"
      stroke="url(#att-strand)" strokeLinecap="round"
      strokeWidth={index === 1 ? '8' : '6'} pathLength="1" strokeDasharray="1 1"
      strokeDashoffset={1 - [one, two, three][index]}/>)}
    <circle cx="584" cy="140" r={14 * point} fill={gold}/>
  </svg>;
}

function enter(frame, start = 0) {
  const amount = gsap.parseEase('power2.out')(progress(frame, start, 18));
  return {opacity: amount, transform: 'translateY(' + 14 * (1 - amount) + 'px)'};
}

function Opening({frame}) {
  return <div className="att-split att-opening">
    <div className="att-copy">
      <div className="att-label">The tension</div>
      <h1>What needs your<br/>attention now?</h1>
      <div className="att-rule"/>
    </div>
    <div className="att-inbox">
      {['Routine question', 'Urgent request', 'New notification'].map((item, index) => <div className="att-inbox-row"
        key={item} style={enter(frame, 18 + 16 * index)}>
        <i className={index === 1 ? 'urgent' : ''}/>{item}
      </div>)}
    </div>
  </div>;
}

function IconScene({frame}) {
  return <div className="att-icon-scene">
    <div className="att-label">AIRFLOW family</div>
    <h1>Attention</h1>
    <Icon frame={frame}/>
    <div className="att-icon-legend" style={enter(frame, 62)}>
      <span><i/>Competing demands</span><span><i className="urgent"/>A point of focus</span>
    </div>
  </div>;
}

function Patterns({frame}) {
  return <div className="att-pattern-scene">
    <div className="att-label">The Attention family</div>
    <h1>Four ways to design for attention</h1>
    <div className="att-patterns">
      {attention.patterns.map(({name: title}, index) => <div className="att-pattern" style={enter(frame, 12 + 12 * index)} key={title}>
        <span className={index === 0 ? 'att-pattern-mark urgent' : 'att-pattern-mark'}/>
        <div><h2>{title}</h2><p>{patternDescriptions[title]}</p></div>
      </div>)}
    </div>
  </div>;
}

function Incident({frame}) {
  return <div className="att-split">
    <div className="att-copy">
      <div className="att-label">A pattern in practice</div>
      <h1>Protected Focus</h1>
      <p>Agree a focus window<br/>before you start.</p>
    </div>
    <div className="att-report" style={enter(frame, 10)}>
      <div className="att-report-label">Report in progress</div>
      {[0.88, 0.69, 0.82, 0.54].map((width, index) => <div className="att-report-line"
        key={width} style={{width: (100 * width * progress(frame, 12 + index * 11, 20)) + '%'}}/>)}
      <div className="att-alert" style={enter(frame, 34)}><i className="urgent"/>Urgent request</div>
    </div>
  </div>;
}

function Routing({frame}) {
  return <div className="att-routing">
    <div className="att-label">Protected Focus</div>
    <h1>Give requests a route</h1>
    <div className="att-routes">
      <div className="att-route" style={enter(frame, 12)}><b>Routine</b><div><span>→</span></div><p>Wait until the focus window ends</p></div>
      <div className="att-route" style={enter(frame, 28)}><b>Urgent</b><div className="urgent"><span>→</span></div><p>Go to a named backup</p></div>
    </div>
    <div className="att-note" style={enter(frame, 80)}>Agree when a direct interruption is warranted.</div>
  </div>;
}

function Review({frame}) {
  return <div className="att-review">
    <div className="att-label">Try it once</div>
    <h1>Did focus improve?<br/>Who carried the load?</h1>
    <div className="att-review-items">
      {['Report quality', 'Urgent response', 'Backup workload'].map((item, index) => <span key={item}
        style={enter(frame, 16 + 12 * index)}><i className={index === 2 ? 'urgent' : ''}/>{item}</span>)}
    </div>
    <div className="att-credit">AIRFLOW by Ilya Alexander Yacine</div>
  </div>;
}

const shots = {open: Opening, icon: IconScene, patterns: Patterns, incident: Incident, routing: Routing, review: Review};

function AttentionScene({scene}) {
  const frame = useCurrentFrame();
  const Shot = shots[scene.id];
  const cue = scene.captions.find(({from, to}) => scene.from + frame >= from && scene.from + frame < to);
  const opacity = progress(frame, 0, 10) * progress(scene.duration - frame, 1, 10);
  return <>
    <div className="att-stage" style={{opacity}}><Shot frame={frame}/></div>
    {cue && <div className="att-caption"><span>{cue.text}</span></div>}
  </>;
}

function AttentionFilm() {
  const frame = useCurrentFrame();
  return <AbsoluteFill className="airflow-attention">
    <Audio src={staticFile('attention/narration.wav')}/>
    <div className="att-header"><span>AIRFLOW</span><span>Pattern families</span></div>
    {scenes.map((scene) => <Sequence key={scene.id} name={scene.id} from={scene.from}
      durationInFrames={scene.duration}><AttentionScene scene={scene}/></Sequence>)}
    <div className="att-progress"><div style={{width: ((frame + 1) / duration * 100) + '%'}}/></div>
  </AbsoluteFill>;
}

export function AttentionComposition() {
  return <Composition id="AirflowAttention" component={AttentionFilm} durationInFrames={duration}
    fps={fps} width={1280} height={720}/>;
}
