// CreateQuest.jsx: Premium Google Forms Clone for Quest Creation
//
// DESIGN KEY FEATURES:
// 1. Google Forms Aesthetic: Rendered as a stack of card cards on a soft background, featuring a top colored accent stripe.
// 2. Active Left Border Glow: Using `focus-within:border-l-4 focus-within:border-l-[#FF6B47]` to create the exact active question highlight of Google Forms.
// 3. Underlined Text Inputs: Flat styled inputs with bottom border animations on focus.
// 4. Submission Response State: Emulates the Google Forms "Response recorded" confirmation layout once successfully created.
//
// LOGIC KEY FEATURES:
// 1. Full Layout Wrapper: Mounts the global Navbar and Sidebar layout to maintain navigation continuity.
// 2. Alignment with Zod Schema: Performs client-side validation that exactly mirrors the backend zod schema (e.g. title length, future deadline, spot bounds).
// 3. Dynamic Tag Parsing: Parses a comma-separated text input into a string array.
// 4. API Error Propagation: Safely parses backend validation responses and presents them on the relevant form inputs.

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../../layout/Navbar'
import Sidebar from '../Sidebar'
import api from '../../../api/axios'

// Helper component to frame each form question as a clean Google Form card
const FormField = ({ label, description, required, error, children }) => {
  return (
    <div className="bg-white dark:bg-[#1E1E1B] rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] p-6 shadow-xs relative focus-within:border-l-4 focus-within:border-l-[#FF6B47] transition-all duration-150">
      <div className="mb-3">
        <label className="block text-base font-semibold text-[#1A1916] dark:text-[#F0EEE9]">
          {label} {required && <span className="text-[#EF4444] ml-0.5">*</span>}
        </label>
        {description && (
          <p className="text-xs text-[#6B6860] dark:text-[#9E9B95] mt-1 leading-normal">
            {description}
          </p>
        )}
      </div>
      {children}
      {error && (
        <p className="mt-2 text-xs text-[#EF4444] font-semibold flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

const CreateQuest = () => {
  const navigate = useNavigate();
  
  // Track form field values
  const [formData, setFormData] = useState({
    title: "",
    category: "Paid",
    description: "",
    location: "",
    isOnline: true,
    deadline: "",
    eventDate: "",
    spotsTotal: 1,
    imageUrl: "",
    tagsInput: "",
  });

  // Track validation and network states
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Field change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear field-specific validation errors when edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Perform client-side Zod validation alignment
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Quest title is required.";
    } else if (formData.title.length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters.";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters.";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters.";
    }

    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      if (isNaN(deadlineDate.getTime())) {
        newErrors.deadline = "Invalid date format.";
      } else if (deadlineDate <= new Date()) {
        newErrors.deadline = "Deadline must be a future date.";
      }
    }

    if (formData.eventDate && isNaN(new Date(formData.eventDate).getTime())) {
      newErrors.eventDate = "Invalid event date format.";
    }

    const spots = Number(formData.spotsTotal);
    if (isNaN(spots) || spots < 1 || spots > 100) {
      newErrors.spotsTotal = "Spots must be an integer between 1 and 100.";
    }

    if (formData.imageUrl) {
      try {
        new URL(formData.imageUrl);
      } catch (_) {
        newErrors.imageUrl = "Please enter a valid cover image URL (e.g. https://...).";
      }
    }

    const parsedTags = formData.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    if (parsedTags.length > 5) {
      newErrors.tagsInput = "Maximum 5 tags are allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError("");

    // Package request payload matching Zod expectations
    const requestData = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      location: formData.location || undefined,
      isOnline: formData.isOnline,
      spotsTotal: Number(formData.spotsTotal),
      imageUrl: formData.imageUrl || undefined,
      deadline: formData.deadline || undefined,
      eventDate: formData.eventDate || undefined,
      tags: formData.tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
    };

    try {
      // POST to backend "/roles" route
      await api.post('/roles', requestData);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitError(
        err.response?.data?.message || "Failed to create quest. Please check fields and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset helper to submit another quest form
  const handleResetForm = () => {
    setFormData({
      title: "",
      category: "Paid",
      description: "",
      location: "",
      isOnline: true,
      deadline: "",
      eventDate: "",
      spotsTotal: 1,
      imageUrl: "",
      tagsInput: "",
    });
    setErrors({});
    setIsSubmitted(false);
  };

  // Standard flat underlined input styling classes
  const inputClass = "w-full py-2 bg-transparent border-b border-[#E8E6E1] dark:border-[#312F2C] focus:border-[#FF6B47] dark:focus:border-[#FF6B47] text-sm text-[#1A1916] dark:text-[#F0EEE9] outline-none transition-colors duration-150";

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#141412] text-[#1A1916] dark:text-[#F0EEE9] transition-colors duration-200">
      <Navbar />

      <div className="flex">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Form Container Column */}
        <main className="flex-1 max-w-2xl mx-auto px-4 py-6 sm:py-8 pb-24 md:pb-8">
          {isSubmitted ? (
            /* Google Form Success Confirmation State */
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#1E1E1B] rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] shadow-xs relative overflow-hidden">
                <div className="h-[10px] w-full bg-[#FF6B47]" />
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-[#1A1916] dark:text-[#F0EEE9] mb-3">
                    Quest Form
                  </h2>
                  <p className="text-sm text-[#6B6860] dark:text-[#9E9B95] mb-6">
                    Your quest has been successfully registered and published on the feed.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <button
                      onClick={handleResetForm}
                      className="text-[#FF6B47] hover:text-[#E85A38] text-sm font-semibold transition-colors outline-none cursor-pointer"
                    >
                      Submit another quest
                    </button>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <button
                      onClick={() => navigate('/quests')}
                      className="text-[#FF6B47] hover:text-[#E85A38] text-sm font-semibold transition-colors outline-none cursor-pointer"
                    >
                      Go to Quest Feed
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Form Fields Deck */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Form Title Header Card */}
              <div className="bg-white dark:bg-[#1E1E1B] rounded-[16px] border border-[#E8E6E1] dark:border-[#312F2C] shadow-xs relative overflow-hidden">
                <div className="h-[10px] w-full bg-[#FF6B47]" />
                <div className="p-6">
                  <h2 className="text-2xl font-extrabold text-[#1A1916] dark:text-[#F0EEE9] font-sans">
                    Create a Quest
                  </h2>
                  <p className="text-sm text-[#6B6860] dark:text-[#9E9B95] mt-2">
                    Fill out this form to publish a new side quest. Other members will be able to apply and join your party.
                  </p>
                  <p className="text-xs text-[#EF4444] mt-4 font-semibold">
                    * Required
                  </p>
                </div>
              </div>

              {submitError && (
                <div className="text-sm px-4 py-3 rounded-[12px] bg-red-500/10 text-[#EF4444] border border-red-500/20">
                  {submitError}
                </div>
              )}

              {/* Title Card */}
              <FormField 
                label="Quest Title" 
                description="Give your quest a clear and descriptive title."
                required
                error={errors.title}
              >
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Build landing page design"
                  className={inputClass}
                  maxLength={100}
                />
              </FormField>

              {/* Category Card */}
              <FormField 
                label="Category" 
                description="Choose the primary domain of this quest."
                required
                error={errors.category}
              >
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Paid" style={{ backgroundColor: '#FF0018', color: '#FFFFFF', fontWeight: 'bold' }}>Paid</option>
                  <option value="Unpaid" style={{ backgroundColor: '#FFA52C', color: '#1A1916', fontWeight: 'bold' }}>Unpaid</option>
                  <option value="Sports" style={{ backgroundColor: '#FFFF41', color: '#1A1916', fontWeight: 'bold' }}>Sports</option>
                  <option value="Reading" style={{ backgroundColor: '#008018', color: '#FFFFFF', fontWeight: 'bold' }}>Reading</option>
                  <option value="Wasting Time" style={{ backgroundColor: '#00ABCD', color: '#1A1916', fontWeight: 'bold' }}>Wasting Time</option>
                  <option value="Cooking" style={{ backgroundColor: '#0000F9', color: '#FFFFFF', fontWeight: 'bold' }}>Cooking</option>
                  <option value="Gaming" style={{ backgroundColor: '#86007D', color: '#FFFFFF', fontWeight: 'bold' }}>Gaming</option>
                  <option value="Don't Know" style={{ backgroundColor: '#FF69B4', color: '#1A1916', fontWeight: 'bold' }}>Don't know</option>
                </select>
              </FormField>

              {/* Description Card */}
              <FormField 
                label="Description" 
                description="Provide in-depth instructions, rules, requirements, and information about the quest."
                required
                error={errors.description}
              >
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explain details here..."
                  className="w-full py-2 min-h-[100px] bg-transparent border-b border-[#E8E6E1] dark:border-[#312F2C] focus:border-[#FF6B47] text-sm text-[#1A1916] dark:text-[#F0EEE9] outline-none resize-y transition-colors duration-150"
                  maxLength={1000}
                />
              </FormField>

              {/* Location Card */}
              <FormField 
                label="Location" 
                description="Where will the quest take place? (Leave blank for online or remote)."
                error={errors.location}
              >
                <input 
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote, or New York, NY"
                  className={inputClass}
                />
              </FormField>

              {/* Online Radio Card */}
              <FormField 
                label="Quest Type" 
                description="Select whether this quest is done online/remotely or in-person."
              >
                <div className="space-y-3 mt-2">
                  <label className="flex items-center gap-3 cursor-pointer text-sm text-[#1A1916] dark:text-[#F0EEE9]">
                    <input 
                      type="radio" 
                      name="isOnline"
                      checked={formData.isOnline === true}
                      onChange={() => setFormData(prev => ({ ...prev, isOnline: true }))}
                      className="w-4 h-4 text-[#FF6B47] focus:ring-[#FF6B47] border-gray-300"
                    />
                    Online / Remote
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-sm text-[#1A1916] dark:text-[#F0EEE9]">
                    <input 
                      type="radio" 
                      name="isOnline"
                      checked={formData.isOnline === false}
                      onChange={() => setFormData(prev => ({ ...prev, isOnline: false }))}
                      className="w-4 h-4 text-[#FF6B47] focus:ring-[#FF6B47] border-gray-300"
                    />
                    In-Person / Physical Location
                  </label>
                </div>
              </FormField>

              {/* Event & Deadline Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField 
                  label="Deadline" 
                  description="When applications close."
                  error={errors.deadline}
                >
                  <input 
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </FormField>

                <FormField 
                  label="Event Date" 
                  description="When the quest kicks off."
                  error={errors.eventDate}
                >
                  <input 
                    type="datetime-local"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </FormField>
              </div>

              {/* Spots Card */}
              <FormField 
                label="Quest Party Spots" 
                description="Select the maximum amount of adventurers who can join this quest (1 to 100)."
                error={errors.spotsTotal}
              >
                <input 
                  type="number"
                  name="spotsTotal"
                  value={formData.spotsTotal}
                  onChange={handleChange}
                  min={1}
                  max={100}
                  className={inputClass}
                />
              </FormField>

              {/* Image URL Card */}
              <FormField 
                label="Cover Image URL" 
                description="Link to an image for your quest card banner."
                error={errors.imageUrl}
              >
                <input 
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder=""
                  className={inputClass}
                />
              </FormField>

              {/* Tags Card */}
              <FormField 
                label="Tags" 
                description="Enter up to 5 tags, comma-separated."
                error={errors.tagsInput}
              >
                <input 
                  type="text"
                  name="tagsInput"
                  value={formData.tagsInput}
                  onChange={handleChange}
                  placeholder="e.g. React, JavaScript, Design"
                  className={inputClass}
                />
              </FormField>

              {/* Form Buttons */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/quests')}
                  className="px-6 py-2.5 rounded-[8px] text-sm font-semibold text-[#6B6860] hover:text-[#1A1916] hover:bg-[#F5F4F1] dark:text-[#9E9B95] dark:hover:text-[#F0EEE9] dark:hover:bg-[#272724] transition-colors outline-none cursor-pointer"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-[#FF6B47] hover:bg-[#E85A38] text-white text-sm font-semibold rounded-[8px] shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed outline-none"
                >
                  {loading ? "Publishing..." : "Submit"}
                </button>
              </div>

            </form>
          )}
        </main>
      </div>
    </div>
  )
}

export default CreateQuest