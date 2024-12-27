import Editor from '@monaco-editor/react';
import PropTypes from 'prop-types';

export default function Code({ code, setCode, title = "code" }) {
  return (
    <div className="bg-[#0d1117] rounded-lg shadow-lg p-6 border border-white/20">
      <h2 className="text-white text-lg font-semibold mb-4">{title}</h2>
      <div className="border border-white/20 rounded-md">
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