/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, BookOpen, Globe, Phone, Mail } from "lucide-react";
import { colleges } from "../../data/hospitalData";

const PreviewPage = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const found = colleges.find(
    (c) => c.id === Number(collegeId)
  );

  if (found) {
    setCollege(found);
  }

  setLoading(false);
}, [collegeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fffdf7] dark:bg-slate-950 flex items-center justify-center">
        <div className="text-slate-900 dark:text-white">Loading...</div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg mb-6 bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">College not found</h2>
            <p className="text-slate-600 dark:text-slate-400">
              The college you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffdf7] dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg mb-6 bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-200 dark:hover:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden mb-6 h-80 bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
          <img
            src={college.image}
            alt={college.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800">
          <h1 className="text-4xl font-bold mb-2">{college.name}</h1>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-6">
            <MapPin className="w-5 h-5" />
            <p>{college.address}</p>
          </div>

          {/* Courses */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#F9B406] dark:text-teal-400" />
              Available Courses
            </h2>

            <div className="flex flex-wrap gap-2">
              {(Array.isArray(college.courses)
                ? college.courses
                : [college.courses]
              ).map((course, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-xl bg-[#F9B406]/10 dark:bg-teal-500/10 border border-[#F9B406]/20 dark:border-teal-500/20 text-[#F9B406] dark:text-teal-400 text-sm font-medium"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {college.phone && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </div>
                <p className="font-medium">{college.phone}</p>
              </div>
            )}

            {college.email && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
                <p className="font-medium truncate">{college.email}</p>
              </div>
            )}
          </div>

          {college.detailsUrl && (
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <a
                href={college.detailsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F9B406] dark:bg-teal-400 hover:bg-[#e0a205] dark:hover:bg-teal-300 text-slate-950 font-semibold"
              >
                <Globe className="w-4 h-4" />
                Visit Official Website
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;