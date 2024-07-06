import React from 'react';
import { Table } from 'react-bootstrap';
import { Sentence } from '../apis/azureSentiment';

const SentenceTable = ({ sentences }: { sentences: Sentence[]}) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Sentence</th>
          <th>Sentiment</th>
          <th>Positive</th>
          <th>Neutral</th>
          <th>Negative</th>
        </tr>
      </thead>
      <tbody>
        {sentences.map((sentence, index) => (
          <tr key={index}>
            <td>{sentence.text}</td>
            <td>{sentence.sentiment}</td>
            <td>{sentence.confidenceScores.positive.toFixed(2)}</td>
            <td>{sentence.confidenceScores.neutral.toFixed(2)}</td>
            <td>{sentence.confidenceScores.negative.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SentenceTable;
