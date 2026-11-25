import React from 'react';
import {AbsoluteFill, Composition, interpolate, registerRoot, Sequence, useCurrentFrame} from 'remotion';
import './style.css';
import {OverviewComposition} from './Overview';
import {AttentionComposition} from './Attention';

const colors = {teal: '#47E5DB', gold: '#F6D672', ivory: '#F7F3E9'};
const flow = [
  {label: 'Draft', first: 30, second: 10, color: colors.teal},
  {label: 'Verify', first: 15, second: 35, color: colors.gold},
  {label: 'Correct + hand over', first: 5, second: 10, color: '#779999'},
];
const scenes = [
  {
    seconds: 6, stage: 'The incident', title: <>The draft got<br/>faster.</>,
    copy: 'A team uses AI to draft a routine report. The first version is ready in a third of the time.',
  },
  {
    seconds: 7, stage: 'The system', title: <>The report took<br/>more work.</>,
    copy: 'The reviewer spends longer checking claims. Follow the report all the way to acceptance.',
  },
  {
    seconds: 9, stage: 'Attention', title: <>Feedback<br/>Within Reach</>,
    copy: 'Test one report. Send a small sample with its sources to a qualified reviewer before drafting the rest.',
    icon: 'feedback',
  },
  {
    seconds: 9, stage: 'Agency', title: <>Keep Judgement<br/>in Practice</>,
    copy: 'Give the reviewer source access, time to check, and authority to pause. Narrow the scope if they can’t verify the claims.',
    icon: 'judgement',
  },
  {
    seconds: 9, stage: 'The review', title: <>What changed<br/>for whom?</>,
    copy: 'Compare with a similar report at the same quality bar. Ask where effort moved and who carried it.',
  },
];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const ramp = (frame, start, end) => interpolate(frame, [start, end], [0, 1], clamp);
const reveal = (frame, delay) => {
  const amount = ramp(frame, delay, delay + 14);
  return {opacity: amount, transform: 'translateY(' + 12 * (1 - amount) + 'px)'};
};

function Icon({name}) {
  return (
    <svg width="90" height="60" viewBox="0 0 104 70" role="img" aria-label={name}>
      <g fill="none" stroke={colors.teal} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {name === 'feedback' ? <>
          <circle cx="17" cy="35" r="10"/>
          <circle cx="87" cy="35" r="10" stroke={colors.gold}/>
          <path d="M31 22 Q51 3 75 20 M66 19 L75 20 L73 12 M73 49 Q52 66 29 50 M38 51 L29 50 L31 58"/>
        </> : <>
          <path d="M12 25 Q52 -8 92 25 Q52 58 12 25 Z M52 45 Q49 53 39 55 L27 61 M52 45 Q55 53 65 55 L77 61 M29 54 L27 61 L35 61 M69 61 L77 61 L75 54"/>
          <circle cx="52" cy="25" r="10" stroke={colors.gold}/>
        </>}
      </g>
    </svg>
  );
}

function Bars({frame, full}) {
  const pieces = full ? flow : flow.slice(0, 1);
  const scale = full ? 6.7 : 12;
  return <div className="panel chart">
    <div className="panelHeading">{full ? 'Effort to reach acceptance' : 'Time to first draft'}</div>
    <div className="unit">Minutes per report · illustrative</div>
    {['Previous workflow', 'AI-assisted workflow'].map((label, row) => {
      const key = row === 0 ? 'first' : 'second';
      const total = pieces.reduce((sum, piece) => sum + piece[key], 0);
      const amount = ramp(frame, 8 + row * 15, 45 + row * 18);
      return <div className="barRow" key={label}>
        <div className="barLabel">{label}</div>
        <div className="barLine">
          {pieces.map((piece) => <div key={piece.label} className="segment" style={{
            width: scale * piece[key] * amount, background: piece.color,
          }}>
            {full && piece[key] >= 10 && amount > 0.9 ? piece[key] : ''}
          </div>)}
          <span className="barTotal" style={{opacity: amount}}>{total}</span>
        </div>
      </div>;
    })}
    {full && <div className="legend" style={reveal(frame, 38)}>
      {flow.map((piece) => <span key={piece.label}><i style={{background: piece.color}}/>{piece.label}</span>)}
    </div>}
  </div>;
}

const cardDetails = [
  {heading: 'Verification Budget', rows: [
    ['Work sample', 'One section of one report'],
    ['Quality bar', 'Each claim backed by a source'],
    ['Feedback', 'Qualified review before the full draft'],
  ]},
  {heading: 'Reviewer decision', rows: [
    ['Accept', 'Required checks are complete'],
    ['Correct', 'Send unsupported claims back'],
    ['Pause', 'Narrow scope if checks exceed capacity'],
  ]},
  {heading: 'What to record', rows: [
    ['Effort', 'Drafting, checking, correction and handover'],
    ['Quality', 'Did both reports meet the same criteria?'],
    ['Distribution', 'Whose workload rose or fell?'],
  ]},
];

function DecisionCard({frame, index}) {
  const {heading, rows} = cardDetails[index];
  return <div className="panel card">
    <div className="panelHeading">{heading}</div>
    {rows.map(([label, content], row) => <div className="cardRow" key={label} style={reveal(frame, 13 + row * 25)}>
      <div className={'cardDot' + (row === 2 ? ' gold' : '')}/>
      <div><div className="cardLabel">{label}</div><div className="cardValue">{content}</div></div>
    </div>)}
  </div>;
}

function Backdrop({frame}) {
  return <svg className="backdrop" width="1280" height="720" viewBox="0 0 1280 720">
    <g transform={'translate(' + 14 * Math.sin(frame / 135) + ' 0)'} fill="none">
      <path d="M-60 647 C 173 595, 278 747, 553 636 S 1000 535, 1350 622" stroke="#2D9B95" strokeWidth="1.5"/>
      <path d="M-60 670 C 242 609, 297 757, 598 645 S 1010 570, 1350 641" stroke="#27716E" strokeWidth="1.5"/>
      <path d="M-60 686 C 219 647, 331 771, 620 660 S 1025 619, 1350 659" stroke="#566E50" strokeWidth="1.5"/>
    </g>
  </svg>;
}

function Scene({scene, index}) {
  const frame = useCurrentFrame();
  return <div className="scene">
    <section className="intro">
      <div className="stage" style={reveal(frame, 0)}>
        {scene.icon && <Icon name={scene.icon}/>}
        <span>{scene.stage}</span>
      </div>
      <h1 style={reveal(frame, 3)}>{scene.title}</h1>
      <p style={reveal(frame, 8)}>{scene.copy}</p>
    </section>
    <div className="visual" style={reveal(frame, 8)}>
      {index < 2 ? <Bars frame={frame} full={index === 1}/> : <DecisionCard frame={frame} index={index - 2}/>}
    </div>
  </div>;
}

const fps = 30;
const duration = scenes.reduce((sum, scene) => sum + fps * scene.seconds, 0);

function Pilot() {
  const frame = useCurrentFrame();
  return <AbsoluteFill className="film">
    <Backdrop frame={frame}/>
    <header><div className="wordmark">AIRFLOW</div><div>Illustrative scenario</div></header>
    {scenes.map((scene, index) => (
      <Sequence key={scene.stage} name={scene.stage} from={scenes.slice(0, index).reduce((sum, item) => sum + fps * item.seconds, 0)} durationInFrames={scene.seconds * fps} layout="none">
        <Scene scene={scene} index={index}/>
      </Sequence>
    ))}
    <footer>
      <span>Pattern language by Ilya Alexander Yacine</span>
      <div className="progress"><div style={{width: (frame + 1) / duration * 100 + '%'}}/></div>
    </footer>
  </AbsoluteFill>;
}

function Root() {
  return <>
    <Composition id="AirflowPilot" component={Pilot} durationInFrames={duration} fps={fps} width={1280} height={720}/>
    <OverviewComposition/>
    <AttentionComposition/>
  </>;
}

registerRoot(Root);
