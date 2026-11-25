import React from 'react';
import {AbsoluteFill, Audio, Composition, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import timeline from './overview-timeline.json';
import catalog from '../data/patterns.json';
import './overview.css';

const {fps, duration, scenes} = timeline;
const teal = '#13CFC6';
const gold = '#F0C75D';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const ramp = (frame, start, length = 18) => interpolate(frame, [start, start + length], [0, 1], clamp);
const families = catalog.families.map(({name}) => name);
const perspectives = [
  ['Flow Science', 'What supports deep engagement?'],
  ['Biomimicry', 'How do living systems sense and adapt?'],
  ['Organizational Development', 'How do roles and relationships shape action?'],
  ['Artificial Intelligence', 'Where can technology support judgement?'],
];

function entrance(frame, delay) {
  const progress = ramp(frame, delay);
  return {opacity: progress, transform: 'translateY(' + (1 - progress) * 12 + 'px)'};
}

function Trace({d, progress, color = teal, width = 2, opacity = 1}) {
  return <path d={d} pathLength="1" fill="none" stroke={color} strokeWidth={width}
    strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - progress} opacity={opacity}/>;
}

function Current({frame, closing = false}) {
  const trace = (delay) => ramp(frame, delay, 72);
  const pulse = 0.7 + 0.3 * Math.sin(frame / 28);
  return <svg viewBox="0 0 560 450" className="current" aria-hidden="true">
    <defs>
      <radialGradient id="currentGlow">
        <stop stopColor={teal} stopOpacity=".23"/>
        <stop offset="1" stopColor={teal} stopOpacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="304" cy="206" r="192" fill="url(#currentGlow)" opacity={trace(7)}/>
    <ellipse cx="304" cy="205" rx="160" ry="122" fill="none" stroke="#2c6263" opacity={trace(16)}/>
    <ellipse cx="304" cy="205" rx="184" ry="146" fill="none" stroke="#245759" opacity={trace(0)}/>
    <Trace d="M18 358 C115 356 130 283 191 244 S290 208 337 154 S407 57 527 57" progress={trace(4)} width={2.7}/>
    <Trace d="M41 378 C130 375 154 302 217 266 S321 240 358 184 S424 93 498 89" progress={trace(14)} opacity=".7"/>
    <Trace d="M75 397 C179 386 174 336 247 299 S408 289 468 193" progress={trace(24)} opacity=".45"/>
    <Trace d="M192 244 C225 210 213 161 248 126 S312 92 331 52" progress={trace(30)} opacity=".85"/>
    <Trace d="M247 299 C296 322 369 360 463 316" progress={trace(40)} opacity=".65"/>
    <Trace d="M191 244 C231 216 268 221 304 185" progress={trace(30)} color={gold} width={3}/>
    <g fill={gold} opacity={trace(45)}>
      <circle cx="191" cy="244" r="5"/>
      <circle cx="304" cy="185" r={closing ? 8 : 7}/>
      <circle cx="304" cy="185" r={13 + pulse * 8} fill="none" stroke={gold} strokeOpacity=".4"/>
      <circle cx="463" cy="316" r="4"/>
    </g>
  </svg>;
}

function Workflow({frame, cue}) {
  return <div className="workflow">
    <div className="diagram-label">Illustrative workflow</div>
    <div className="workflow-track">
      {['Draft', 'Verify claims', 'Accept'].map((stage, index) => (
        <React.Fragment key={stage}>
          {index > 0 && <span aria-hidden="true">→</span>}
          <div className={index === 1 && cue > 0 ? 'workflow-node bottleneck' : 'workflow-node'}>{stage}</div>
        </React.Fragment>
      ))}
    </div>
    <div className="queue">
      {Array.from({length: 5}, (_, index) => <div key={index} style={{
        opacity: ramp(frame, 26 + index * 14) * (cue === 0 ? 0.45 : 1),
        transform: 'translateX(' + (1 - ramp(frame, 26 + index * 14)) * -30 + 'px)',
      }}/>)}
    </div>
    <div className="diagram-note" style={{opacity: cue > 0 ? 1 : 0}}>Where did the work move?</div>
  </div>;
}

function LensMap({frame, cue}) {
  return <div className="lens-map">
    <div className="lens-rows">
      {perspectives.map(([label, question], index) => <div key={label}
        className={cue === index ? 'lens-row focused' : 'lens-row'} style={entrance(frame, 5 + 7 * index)}>
        <div className="lens-point"/>
        <div><strong>{label}</strong><span>{question}</span></div>
      </div>)}
    </div>
    <svg className="lens-branches" width="270" height="304" viewBox="0 0 270 304" aria-hidden="true">
      {[37, 113, 189, 265].map((y, index) => <Trace key={y}
        d={'M2 ' + y + ' C115 ' + y + ' 119 152 264 152'}
        progress={ramp(frame, 5 + 10 * index, 42)} width={cue === index ? 3 : 1.5}
        opacity={cue === index ? 1 : 0.35}/>)}
      <circle cx="264" cy="152" r="5" fill={gold} opacity={ramp(frame, 31)}/>
    </svg>
    <div className="lens-outcome" style={entrance(frame, 26)}>What could we<br/>change in the work?</div>
  </div>;
}

const derivation = [
  ['Context', 'Where does the situation recur?'],
  ['Tension', 'Which needs pull in different directions?'],
  ['Move', 'What arrangement could change?'],
  ['Boundary', 'Where should the move be limited?'],
];

function Derivation({frame, cue}) {
  return <>
    <div className="derivation">
      {derivation.map(([label, question], index) => <div key={label} style={entrance(frame, index * 8)}>
        <b>{label}</b><span>{question}</span>
      </div>)}
    </div>
    <div className="transfer" style={{opacity: cue >= 1 ? 1 : 0}}>
      <span>Local sensing in nature</span><i aria-hidden="true">→</i>
      <span>Customer signals reach a team that can act</span>
    </div>
  </>;
}

function FocusExample({frame, cue}) {
  const showMove = cue >= 1;
  return <div className="focus-example">
    <div className="focus-source">Incoming requests</div>
    <svg width="175" height="240" viewBox="0 0 175 240" aria-hidden="true">
      <Trace d="M0 120 C80 120 75 57 170 57" progress={ramp(frame, 10, 30)} width={2.5}/>
      <Trace d="M0 120 C80 120 75 181 170 181" progress={showMove ? 1 : 0.25} width={2.5} color={gold}/>
      <circle cx="42" cy="120" r="5" fill={gold}/>
    </svg>
    <div className="focus-branches">
      <div><b>Focus window</b><span>{showMove ? 'Routine requests wait' : 'Protect concentration'}</span></div>
      <div><b>{showMove ? 'Named backup' : 'Urgent requests'}</b><span>{showMove ? 'Urgent requests go here' : 'Keep a reliable response'}</span></div>
    </div>
    <div className="diagram-note focus-note" style={{opacity: cue >= 2 ? 1 : 0}}>Review quality, response, and workload.</div>
  </div>;
}

function Apply({frame, cue}) {
  const steps = [
    ['01', 'Name the incident', 'Where did work stall? Who was affected?'],
    ['02', 'Choose a pattern', 'Try one change. Balance it where needed.'],
    ['03', 'Agree how to review', 'Decide what to observe and when to stop.'],
  ];
  return <div className="apply-steps">
    {steps.map(([number, label, detail], index) => <div key={number} style={entrance(frame, index * 10)}
      className={cue === index ? 'apply-step focused' : 'apply-step'}>
      <span>{number}</span><div><b>{label}</b><p>{detail}</p></div>
    </div>)}
  </div>;
}

function FamilyList({frame}) {
  return <div className="family-list">
    {families.map((family, index) => <div key={family} style={entrance(frame, 7 + index * 8)}>
      <span className="family-point"/>{family}
    </div>)}
  </div>;
}

function OverviewScene({scene}) {
  const frame = useCurrentFrame();
  const absoluteFrame = scene.from + frame;
  const cue = scene.captions.findIndex(({from, to}) => absoluteFrame >= from && absoluteFrame < to);
  const activeCue = scene.captions.reduce((last, item, index) => absoluteFrame >= item.from ? index : last, -1);
  return <>
    <div className={'over-scene over-' + scene.id} style={{opacity: ramp(frame, 0, 13) * ramp(scene.duration - frame, 0, 10)}}>
      <div className="over-heading">
        <div className="over-label">{scene.label}</div>
        <h1>{scene.title.map((line) => <span key={line}>{line}</span>)}</h1>
        {scene.id === 'purpose' && <p className="over-deck">AI-supported Regenerative<br/>Flow for Organizations</p>}
        {scene.id === 'close' && <p className="over-deck">Created by Ilya Alexander Yacine</p>}
        {scene.id === 'example' && <p className="over-deck">Concentration with<br/>reliable availability.</p>}
      </div>
      {scene.id === 'purpose' && <Current frame={frame}/>}
      {scene.id === 'problem' && <Workflow frame={frame} cue={activeCue}/>}
      {scene.id === 'lenses' && <LensMap frame={frame} cue={activeCue}/>}
      {scene.id === 'derive' && <Derivation frame={frame} cue={activeCue}/>}
      {scene.id === 'example' && <FocusExample frame={frame} cue={activeCue}/>}
      {scene.id === 'apply' && <Apply frame={frame} cue={activeCue}/>}
      {scene.id === 'families' && <FamilyList frame={frame}/>}
      {scene.id === 'close' && <Current frame={frame} closing/>}
    </div>
    {cue >= 0 && <div className="over-caption"><span>{scene.captions[cue].text}</span></div>}
  </>;
}

function OverviewFilm() {
  const frame = useCurrentFrame();
  return <AbsoluteFill className="airflow-overview">
    <Audio src={staticFile('overview/narration.wav')}/>
    <div className="over-wordmark">AIRFLOW</div>
    {scenes.map((scene) =>
      <Sequence from={scene.from} durationInFrames={scene.duration} key={scene.id} name={scene.label}>
        <OverviewScene scene={scene}/>
      </Sequence>
    )}
    <div className="over-progress"><div style={{width: ((frame + 1) / duration * 100) + '%'}}/></div>
  </AbsoluteFill>;
}

export function OverviewComposition() {
  return <Composition id="AirflowOverview" component={OverviewFilm} durationInFrames={duration}
    fps={fps} width={1280} height={720}/>;
}
