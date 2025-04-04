import Editor from '@monaco-editor/react';
import PropTypes from 'prop-types';

export default function Code({ code, setCode, title = "Code" }) {
  return (
    <div className="bg-neutral-800 rounded-lg shadow-lg p-6 border border-neutral-700/30 hover:border-neutral-600/50 transition-all">
      <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>
      <div className="bg-neutral-700/50 border border-neutral-700/30 hover:border-neutral-600/50 transition-all rounded-lg overflow-hidden">
        <Editor
          height="50vh"
          theme="vs-dark"
          defaultLanguage="cpp"
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>
    </div>
  );
}

Code.propTypes = {
  code: PropTypes.string.isRequired,
  setCode: PropTypes.func.isRequired,
  title: PropTypes.string
};