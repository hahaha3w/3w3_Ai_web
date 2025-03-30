import React from 'react';
import { Icon } from '@iconify-icon/react/dist/iconify.js';
import { MODELS } from '@/models/modelDefinitions';
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from 'oh-my-live2d';
import styles from './Sidebar.module.scss';

interface ModelSelectorProps {
  currentModelIndex: number;
  isSwitching: boolean;
  oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
  onModelChange: (index: number) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentModelIndex,
  isSwitching,
  oml2d,
  onModelChange,
}) => {
  const handleModelChange = (index: number) => {
    if (oml2d && !isSwitching) {
      onModelChange(index);
    }
  };

  return (
    <div className={styles.modelSelector}>
      {MODELS.map((model, index) => (
        <div
          key={model.id}
          className={`${styles.modelItem} ${
            currentModelIndex === index ? styles.active : ""
          } ${isSwitching ? styles.disabled : ""}`}
          onClick={() => handleModelChange(index)}
        >
          <Icon
            icon={model.icon}
            className={`text-2xl ${
              currentModelIndex === index
                ? "text-blue-500"
                : "text-gray-600"
            }`}
          />
          <span
            className={`ml-2 ${
              currentModelIndex === index
                ? "text-blue-500 font-medium"
                : "text-gray-700"
            }`}
          >
            {model.name}
          </span>
          {currentModelIndex === index && (
            <Icon
              icon="material-symbols:check-circle"
              className="text-blue-500 ml-auto"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ModelSelector;
