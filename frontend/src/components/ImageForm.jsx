import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../services/api";
import "../App.css";
const categoryOptions = [
  { value: "wedding", label: "Bodas" },
  { value: "newborn", label: "Recién Nacidos" },
  { value: "portrait", label: "Retratos" },
  { value: "artistic", label: "Artístico" },
];
const validationSchema = Yup.object().shape({
  title: Yup.string().required("El título es requerido"),
  category: Yup.string().required("Selecciona una categoría"),
  image: Yup.mixed().required("La imagen es requerida"),
});

const ImageForm = ({ initialValues, onSubmit }) => {
  const [preview, setPreview] = useState(initialValues?.image || null);

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("image", file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <Formik
      initialValues={initialValues || { title: "", category: "", image: null }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, isSubmitting }) => (
        <Form className="form-container">
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <Field name="title" type="text" className="form-input" />
            <ErrorMessage
              name="title"
              component="div"
              className="error-message"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <Field as="select" name="category" className="form-select">
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="category"
              component="div"
              className="error-message"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Imagen</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setFieldValue)}
              className="form-file"
            />
            <ErrorMessage
              name="image"
              component="div"
              className="error-message"
            />

            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Vista previa" />
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Guardando..." : "Guardar Imagen"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ImageForm;
