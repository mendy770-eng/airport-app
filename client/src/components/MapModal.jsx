import CloseIcon from '@mui/icons-material/Close';
import AirportInspector from '../dashboard/AirportInspector';
import './css/map.css';

const MapModal = ({ type, onClose }) => {
  const getComponent = () => {
    switch(type) {
      case 'airport_inspector':
        return <AirportInspector isSuperviser={true} />;
      case 'manager':
        return <div>Manager Component</div>;
      case 'ground_attendant':
        return <div>Ground Attendant Component</div>;
      case 'technicion':
        return <div>Technician Component</div>;
      default:
        return null;
    }
  };

  return (
    <div className="modal-container">
      <button onClick={onClose} className="close-button">
        <CloseIcon fontSize="small" />
      </button>
      {getComponent()}
    </div>
  );
};

export default MapModal; 