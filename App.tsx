
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { QuestionCard } from './components/QuestionCard';
import { KIPS_CHAPTERS } from './constants';
import { generateQuestions } from './geminiService';
import { GenerationConfig, Question, QuestionType } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<GenerationConfig>({
    chapterId: 1,
    questionTypes: [QuestionType.MCQ, QuestionType.SHORT],
    count: 5,
    difficulty: 'Medium'
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTypeToggle = (type: QuestionType) => {
    setConfig(prev => {
      const exists = prev.questionTypes.includes(type);
      const newTypes = exists 
        ? prev.questionTypes.filter(t => t !== type)
        : [...prev.questionTypes, type];
      
      return { ...prev, questionTypes: newTypes.length > 0 ? newTypes : [type] };
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateQuestions(config);
      setQuestions(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const activeChapter = KIPS_CHAPTERS.find(c => c.id === config.chapterId);

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Controls */}
        <aside className="lg:col-span-4 no-print">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              IT 417 Config
            </h2>

            <div className="space-y-6">
              {/* Chapter Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Unit / Chapter</label>
                <select 
                  value={config.chapterId}
                  onChange={(e) => setConfig({...config, chapterId: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-slate-50 cursor-pointer"
                >
                  {KIPS_CHAPTERS.map(ch => (
                    <option key={ch.id} value={ch.id}>{ch.id}. {ch.title}</option>
                  ))}
                </select>
                {activeChapter && (
                  <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-700 uppercase mb-1">Topics covered:</p>
                    <p className="text-xs text-indigo-600 leading-relaxed italic">
                      {activeChapter.topics.join(", ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Question Types */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Question Types</label>
                <div className="flex flex-wrap gap-2">
                  {Object.values(QuestionType).map(type => (
                    <button
                      key={type}
                      onClick={() => handleTypeToggle(type)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        config.questionTypes.includes(type)
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Count & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="20"
                    value={config.count}
                    onChange={(e) => setConfig({...config, count: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty</label>
                  <select 
                    value={config.difficulty}
                    onChange={(e) => setConfig({...config, difficulty: e.target.value as any})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 cursor-pointer"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
                  loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating IT Material...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95V4.31a8.001 8.001 0 016.743 6.743 1 1 0 01-.95.897H15.01a1 1 0 01-.994-1.096A4.99 4.99 0 0010 6a4.99 4.99 0 00-4.016 5.014 1 1 0 01-.994 1.096H2.031a1 1 0 01-.95-.897 8.001 8.001 0 016.743-6.743V1.997a1 1 0 01.897-.95l.13-.01a1 1 0 01.499.01l.13.01zM10 13a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd" />
                    </svg>
                    <span>Generate Questions</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start space-x-2 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content: Questions Display */}
        <div className="lg:col-span-8">
          {questions.length > 0 ? (
            <div>
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {activeChapter?.title}
                  </h2>
                  <p className="text-slate-500 mt-1">Class 9 Information Technology (417) Study Material</p>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-600 no-print">
                  {questions.length} Questions Generated
                </div>
              </div>

              <div className="space-y-6 pb-12">
                {questions.map((q, idx) => (
                  <QuestionCard key={q.id || idx} question={q} index={idx} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-700">Class 9 IT (417) Study Assistant</h3>
              <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                Generate custom questions, answers, and explanations based on the KIPS Information Technology curriculum (Subject Code 417).
              </p>
              <button 
                onClick={handleGenerate}
                className="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 no-print"
              >
                Generate Chapter {config.chapterId} Material
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
