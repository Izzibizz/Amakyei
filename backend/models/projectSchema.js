import mongoose from "mongoose";

const { Schema, model } = mongoose;

const categoryEnum = ["dancer", "choreographer", "pedagog"];

const projectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: categoryEnum,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  description2: {
    type: String,
  },
  credits: [
    {
      role: {
        type: String, // Role type (e.g., "Dancers", "Choreographer")
        required: true,
      },
      names: [
        {
          name: {
            type: String,
            required: true,
          },
          link: {
            type: String,
          },
        },
      ],
      explanation: {
        type: String,
      },
    },
  ],
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      photographer: {
        type: String, 
      },
      link: {
        type: String,
      },
    },
  ],
  video: [
    {
      url: {
        type: String, //Link to youtube or vimeo
      },
      photographer: {
        type: String, // Photographer's name
      },
      link: {
        type: String, // Photographer's name
      },
    },
  ],
});

export const Projects = model("Project", projectSchema);
