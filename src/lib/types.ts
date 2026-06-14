export enum ExperienceTag {
    Education = "Education",
    Data = "Data",
    Human = "Human",
    Technology = "Technology",
    Math = "Math",
    Management = "Management",
    Arts = "Arts",
    Achievement = "Achievement",
    Language = "Language",
    User = "User"
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string | null;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    avatarUrl: string | null;
  };
}

