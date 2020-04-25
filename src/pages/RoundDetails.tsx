import React from 'react';
import { useParams } from 'react-router-dom';
import { Round, Question as QuestionInterface } from '../App';

interface RoundDetailsProps {
  rounds: Round[];
}

export const RoundDetails = ({ rounds }: RoundDetailsProps) => {
  const { roundNumber } = useParams();
  const currentRound = rounds[Number(roundNumber) - 1];

  return (
    <div>
      <div>round {roundNumber}</div>
      {currentRound &&
        currentRound.questions.map((question, index) => {
          return <Question key={question.id} question={question} index={index} />;
        })}
    </div>
  );
};

interface QuestionProps {
  question: QuestionInterface;
  index: number;
}

export const Question = ({ question, index }: QuestionProps) => {
  const answer = React.useRef<HTMLInputElement>(null);

  return (
    <div>
      <label htmlFor={`answer_${question.id}`}>Vraag {index + 1}</label>
      <div>
        <input id={`answer_${question.id}`} type="text" ref={answer} />
        <button
          onClick={() => {
            if (answer.current) {
              alert(answer.current.value);
            }
          }}>
          Verzenden
        </button>
      </div>
    </div>
  );
};
