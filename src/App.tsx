import React from 'react';

const AtoZ: string[] = [];
for(let i = 65; i < 65+26; i++) AtoZ.push(String.fromCharCode(i));


interface Score{
	attempts: number;
	success: number;
}

type ScoreList = Record<string, Score>;

const defaultScores = AtoZ.reduce((scores, letter) => {
	scores[letter] = {
		attempts: 0,
		success: 0
	};
	return scores;
}, {} as ScoreList) as ScoreList

function chooseNextLetter(scores: ScoreList, currentLetter: string): string{
	let index = 0;
	let nextLetter: string | undefined = undefined; 
	while(index < 25 && nextLetter === undefined){
		index++;
		const candidate = Object.keys(scores)[index];
		if(scores[candidate].attempts === 0) nextLetter = candidate;
	}
	if(nextLetter !== undefined) return nextLetter;
	const needsWork = Object.keys(scores).reduce((current, record) => {
		if((scores[record].attempts/2) >= scores[record].success || scores[record].success === 0) current.push(record);
		return current;
	},[] as string[]);
	if(needsWork.length === 0){
		alert("All letters were completed successfully!");
		return "A";
	}
	if(needsWork.length === 1) return needsWork[0];
	let chosenLetter = "A";
	do{
		chosenLetter = needsWork[Math.round((needsWork.length - 1) * Math.random())]
	}
	while(chosenLetter !== "" && chosenLetter === currentLetter)	
	return chosenLetter;
}

function App() {
	const [{scores,currentLetter}, setState] = React.useState({
		scores: defaultScores,
		currentLetter: AtoZ[0]
	});
	const success = () => {
		scores[currentLetter].attempts++;
		scores[currentLetter].success++;
		setState({
			scores: Object.assign({}, scores),
			currentLetter: chooseNextLetter(scores, currentLetter)
		});
	};
	const failure = () => {
		scores[currentLetter].attempts++;
		setState({
			scores: Object.assign({}, scores),
			currentLetter: chooseNextLetter(scores, currentLetter)
		});
	};
	return <div>
		<Focus letter={currentLetter} />
		<div style={{textAlign:"center"}}>
			<button onClick={success}>Success</button>
			<button onClick={failure}>Failure</button>
		</div>
		<Letters letterSelect={letter => setState({scores, currentLetter: letter})} />
	</div>;
}


interface FocusProps{
	letter: string;
}

function Focus({letter}: FocusProps){
	const FocusContainerStyles: React.CSSProperties = {
		fontSize: "80vh",
		textAlign:"center",
		lineHeight: "1"
	};
	return <div style={FocusContainerStyles}>{letter}{letter.toLowerCase()}</div>;
}

interface LettersProps{
	letterSelect:(letter:string) => void;
}

function Letters({letterSelect}: LettersProps){
	const ContainerStyles:React.CSSProperties = {
		display:"flex",
		flexFlow: "row nowrap",
		justifyContent: "center",
		position: "fixed",
		top:"calc(100vh - 23px)",
		width:"100%"
	};
	return <div style={ContainerStyles}>{AtoZ.map(letter => <Letter onClick={letterSelect} letter={letter} />)}</div>;
}

interface LetterProps{
	letter: string;
	onClick: (letter:string) => void;
}

function Letter({letter, onClick}: LetterProps){
	const LetterStyles: React.CSSProperties = {
		flex:"0 0 20px",
		border:"1px solid black",
		borderRadius:"5px 5px 0 0",
		textAlign:"center",
		padding: "0 2px",
		margin: "0 2px",
		height:"22px",
		cursor:"pointer",
		userSelect:"none"
	};
	return <div style={LetterStyles} onClick={() => onClick(letter)}>{letter}</div>
}

export default App;
