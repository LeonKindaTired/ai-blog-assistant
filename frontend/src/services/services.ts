import axiosInstance from "@/api/axiosInstance.js";

export async function addNewCourseService(formData: any) {
  const { data } = await axiosInstance.post("/courses/add", formData);

  return data;
}
