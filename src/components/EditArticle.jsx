import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
} from "../styles/common";

function EditArticle() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const article = location.state;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Redirect if no article state (e.g. on refresh)
  useEffect(() => {
    if (!article) {
      toast.error("Article data lost. Please try again from the article page.");
      navigate("/author-profile/articles");
      return;
    }

    setValue("title", article.title);
    setValue("category", article.category);
    setValue("content", article.content);
  }, [article, navigate, setValue]);

  const updateArticle = async (modifiedArticle) => {
    try {
      setLoading(true);
      //add articleId to modified article
      modifiedArticle.articleId = article._id;
      
      //make PUT req to update article
      const res = await axios.put(
        "http://localhost:4000/author-api/articles",
        modifiedArticle,
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Article updated successfully!");
        navigate(`/article/${article._id}`, { state: res.data.payload });
      }
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.response?.data?.message || "Failed to update article");
    } finally {
      setLoading(false);
    }
  };

  if (!article) return null;

  return (
    <div className={`${formCard} mt-10`}>
      <h2 className={formTitle}>Edit Article</h2>

      <form onSubmit={handleSubmit(updateArticle)}>
        {/* Title */}
        <div className={formGroup}>
          <label className={labelClass}>Title</label>
          <input 
            className={inputClass} 
            {...register("title", { required: "Title required" })} 
          />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        {/* Category */}
        <div className={formGroup}>
          <label className={labelClass}>Category</label>
          <select 
            className={inputClass} 
            {...register("category", { required: "Category required" })}
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="programming">Programming</option>
            <option value="ai">AI</option>
            <option value="web-development">Web Development</option>
          </select>
          {errors.category && <p className={errorClass}>{errors.category.message}</p>}
        </div>

        {/* Content */}
        <div className={formGroup}>
          <label className={labelClass}>Content</label>
          <textarea 
            rows="14" 
            className={inputClass} 
            {...register("content", { required: "Content required" })} 
          />
          {errors.content && <p className={errorClass}>{errors.content.message}</p>}
        </div>

        <button className={submitBtn} disabled={loading}>
          {loading ? "Updating..." : "Update Article"}
        </button>
      </form>
    </div>
  );
}

export default EditArticle;