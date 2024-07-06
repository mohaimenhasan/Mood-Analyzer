import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import BarChartComponent from './BarChartComponent';
import SentenceTable from './SentenceTable';

const SentimentDetailModal = ({ show, handleClose, song }: { show: any, handleClose: any, song: any }) => {
  if (!song) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Sentiment Analysis for {song.track}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>Overall Sentiment Confidence Scores</h3>
        <BarChartComponent data={song.scores} />
        <h3>Sentence-wise Sentiment Analysis</h3>
        <SentenceTable sentences={song.sentences} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SentimentDetailModal;
