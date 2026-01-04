import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Upload, Save } from 'lucide-react';

const ContentEditor = ({ context, onBack }) => {
  const [formData, setFormData] = useState({
    title: '',
    youtubeId: '',
    blogContent: '',
    metaTitle: '',
    metaDescription: '',
    yearSlug: '',
    unitNumber: '',
    primaryKeyword: '',
    targetKeywords: '',
    questions: [],
    faqs: []
  });

  const [existingTopics, setExistingTopics] = useState([
    { id: 1, title: 'Introduction to Pharmaceutical Chemistry', updatedAt: '2 days ago', active: true },
    { id: 2, title: 'Organic Compounds Classification', updatedAt: '5 days ago', active: false },
    { id: 3, title: 'Functional Groups and Properties', updatedAt: '1 week ago', active: false },
    { id: 4, title: 'Stereochemistry Basics', updatedAt: '2 weeks ago', active: false },
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A'
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId, field, value) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const deleteQuestion = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const handleSave = () => {
    console.log('Saving topic:', formData);
    // API call to save topic
  };

  const selectTopic = (topicId) => {
    setExistingTopics(prev => prev.map(t => ({
      ...t,
      active: t.id === topicId
    })));
    // Load topic data into form
  };

  return (
    <div className="p-6">
      
      {/* Editor Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Content Editor</h2>
          </div>
          <p className="text-gray-600 ml-14">
            {context.yearTitle} → {context.semesterTitle} → {context.subjectTitle}
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Topic
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Existing Topics */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Topics</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
              
              {existingTopics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => selectTopic(topic.id)}
                  className={`w-full text-left px-4 py-3 border rounded-xl transition-all ${
                    topic.active 
                      ? 'bg-primary-50 border-primary-200 hover:bg-primary-100'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <p className={`font-medium text-sm ${
                    topic.active ? 'text-primary-900' : 'text-gray-900'
                  }`}>
                    {topic.title}
                  </p>
                  <p className={`text-xs mt-1 ${
                    topic.active ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    Updated {topic.updatedAt}
                  </p>
                </button>
              ))}

            </div>
            <button className="w-full mt-4 px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:border-primary-400 hover:text-primary-600 font-medium transition-colors">
              + New Topic
            </button>
          </div>
        </div>

        {/* Right: Editor Form */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            
            {/* Basic Info Section */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              
              <div className="space-y-4">
                {/* Topic Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic Title *</label>
                  <input 
                    type="text" 
                    placeholder="Enter topic title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none input-glow focus:border-primary-500"
                  />
                </div>

                {/* YouTube ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g., dQw4w9WgXcQ"
                    value={formData.youtubeId}
                    onChange={(e) => handleInputChange('youtubeId', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none input-glow focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blog Content</h3>
              
              {/* Rich Text Editor Placeholder */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Toolbar */}
                <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-1 flex-wrap">
                  <button className="p-2 hover:bg-gray-200 rounded text-gray-700 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded text-gray-700 font-bold transition-colors">B</button>
                  <button className="p-2 hover:bg-gray-200 rounded text-gray-700 italic transition-colors">I</button>
                  <button className="p-2 hover:bg-gray-200 rounded text-gray-700 underline transition-colors">U</button>
                  <div className="w-px h-6 bg-gray-300 mx-1"></div>
                  <button className="p-2 hover:bg-gray-200 rounded text-gray-700 text-sm font-semibold transition-colors">H1</button>
                  <button className="p-2 hover:bg-gray-200 rounded text-gray-700 text-sm font-semibold transition-colors">H2</button>
                </div>
                {/* Content Area */}
                <textarea 
                  className="w-full p-4 min-h-[300px] focus:outline-none resize-none"
                  placeholder="Start writing your blog content here..."
                  value={formData.blogContent}
                  onChange={(e) => handleInputChange('blogContent', e.target.value)}
                />
              </div>
            </div>

            {/* SEO Section */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO & Metadata</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  <input 
                    type="text" 
                    placeholder="SEO-optimized title"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none input-glow focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year Slug</label>
                  <input 
                    type="text" 
                    placeholder="e.g., first-year"
                    value={formData.yearSlug}
                    onChange={(e) => handleInputChange('yearSlug', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none input-glow focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit Number</label>
                  <input 
                    type="number" 
                    placeholder="1"
                    value={formData.unitNumber}
                    onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none input-glow focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Keyword</label>
                  <input 
                    type="text" 
                    placeholder="Main keyword"
                    value={formData.primaryKeyword}
                    onChange={(e) => handleInputChange('primaryKeyword', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none input-glow focus:border-primary-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea 
                    rows="3"
                    placeholder="SEO meta description (160 characters max)"
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none input-glow focus:border-primary-500 resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Keywords (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="keyword1, keyword2, keyword3"
                    value={formData.targetKeywords}
                    onChange={(e) => handleInputChange('targetKeywords', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none input-glow focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Quiz Section */}
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Quiz Questions</h3>
                <button 
                  onClick={addQuestion}
                  className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>
              
              <div className="space-y-4">
                {formData.questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={updateQuestion}
                    onDelete={deleteQuestion}
                  />
                ))}
                
                {formData.questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No questions added yet. Click "Add Question" to get started.
                  </div>
                )}
              </div>
            </div>

            {/* File Upload Section */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 cursor-pointer transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-1">Drop notes file here or click to upload</p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question, index, onUpdate, onDelete }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
        <button 
          onClick={() => onDelete(question.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <input 
        type="text" 
        placeholder="Enter question"
        value={question.question}
        onChange={(e) => onUpdate(question.id, 'question', e.target.value)}
        className="w-full mb-2 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
      />
      <div className="space-y-2">
        <input 
          type="text" 
          placeholder="Option A" 
          value={question.optionA}
          onChange={(e) => onUpdate(question.id, 'optionA', e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" 
        />
        <input 
          type="text" 
          placeholder="Option B" 
          value={question.optionB}
          onChange={(e) => onUpdate(question.id, 'optionB', e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" 
        />
        <input 
          type="text" 
          placeholder="Option C" 
          value={question.optionC}
          onChange={(e) => onUpdate(question.id, 'optionC', e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" 
        />
        <input 
          type="text" 
          placeholder="Option D" 
          value={question.optionD}
          onChange={(e) => onUpdate(question.id, 'optionD', e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" 
        />
      </div>
      <select 
        value={question.correctAnswer}
        onChange={(e) => onUpdate(question.id, 'correctAnswer', e.target.value)}
        className="w-full mt-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
      >
        <option value="A">Correct Answer: A</option>
        <option value="B">Correct Answer: B</option>
        <option value="C">Correct Answer: C</option>
        <option value="D">Correct Answer: D</option>
      </select>
    </div>
  );
};

export default ContentEditor;
