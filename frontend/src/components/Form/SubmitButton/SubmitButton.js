import React from 'react';

function SubmitButton({ text, disabled }) {
  return (
    <button
      type="submit"
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-blue-700 cursor-pointer'
      }`}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default SubmitButton;
