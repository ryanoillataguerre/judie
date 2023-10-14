import { GradeYear } from "../types/api";

export const subjectSections: string[] = [
  "AP",
  "High School",
  "Middle School",
  "College",
  "Test Prep",
];

export const subjectSectionToSubjectsMap: { [key: string]: string[] } = {
  AP: [
    "AP Art History",
    "AP Biology",
    "AP Calculus AB",
    "AP Calculus BC",
    "AP Chemistry",
    "AP Environmental Science",
    "AP Physics 1",
    "AP Physics 2",
    "AP Statistics",
    "AP US Govt",
    "AP US Hist",
    "AP European History",
    "AP World History",
    "AP Psychology",
    "AP English Literature & Composition",
    "AP English Language & Composition",
    "AP Comparative Government & Politics",
    "AP Human Geography",
    "AP Macroeconomics",
    "AP Microeconomics",
    "AP Computer Science A",
    "AP Computer Science Principles",
  ],
  "High School": [
    // All high school subjects, not including AP
    "Algebra 1",
    "Algebra 2",
    "Ancient History",
    "Art History",
    "College Admissions",
    "Cosmology & Astronomy",
    "World History",
    "Differential Equations",
    "Ecology",
    "Environmental Studies",
    "Geometry",
    "High School Biology",
    "High School Chemistry",
    "High School Physics",
    "High School Statistics",
    "Linear Algebra",
    "Macroeconomics",
    "Microeconomics",
    "Physical Education & Health",
    "Pre-Algebra",
    "Pre-Calculus",
    "Psychology",
    "Sociology",
    "Social Studies",
    "Trigonometry",
    "US Govt & Politics",
    "US History",
    "World History",
    "World Religions",
  ],
  "Middle School": [
    "Middle School Biology",
    "Middle School Earth Space Science",
    "Middle School Physics",
  ],
  College: [
    "Biochemistry",
    "College Algebra",
    "Calculus",
    "Ethics",
    "Inorganic Chemistry",
    "Macroeconomics",
    "Microeconomics",
    "Molecular Biology",
    "Multivariable Calculus",
    "Organic Chemistry",
    "Philosophy",
    "Statistics & Probability",
  ],
  "Test Prep": [
    "LSAT",
    "MCAT",
    "SAT",
    "ACT Preparation",
    "GED Preparation",
    "GMAT Preparation",
    "DAT Prep",
  ],
  Admin: [
    "Default",
    "Content Creation",
    "Lesson Plans",
    "Assignment Generation",
    "Alaska History",
    "PurePromise",
    "Testing",
  ],
};

export const getUserSubjectsForGradeYear = (gradeYear: GradeYear) => {
  switch (gradeYear) {
    case GradeYear.FIRST:
      return [];
    case GradeYear.SECOND:
      return [];
    case GradeYear.THIRD:
      return [];
    case GradeYear.FOURTH:
      return [];
    case GradeYear.FIFTH:
      return [];
    case GradeYear.SIXTH:
      return subjectSectionToSubjectsMap["Middle School"];
    case GradeYear.SEVENTH:
      return subjectSectionToSubjectsMap["Middle School"];
    case GradeYear.EIGHTH:
      return subjectSectionToSubjectsMap["Middle School"];
    case GradeYear.FRESHMAN:
      return subjectSectionToSubjectsMap["High School"];
    case GradeYear.SOPHOMORE:
      return subjectSectionToSubjectsMap["High School"];
    case GradeYear.JUNIOR:
      return subjectSectionToSubjectsMap["High School"];
    case GradeYear.SENIOR:
      return subjectSectionToSubjectsMap["High School"];
    case GradeYear.UNI_FRESHMAN:
      return subjectSectionToSubjectsMap["College"];
    case GradeYear.UNI_SOPHOMORE:
      return subjectSectionToSubjectsMap["College"];
    case GradeYear.UNI_JUNIOR:
      return subjectSectionToSubjectsMap["College"];
    case GradeYear.UNI_SENIOR:
      return subjectSectionToSubjectsMap["College"];
    case GradeYear.GRADUATE:
      return Object.keys(subjectSectionToSubjectsMap).flatMap(
        (section) => subjectSectionToSubjectsMap[section]
      );
    default:
      return Object.keys(subjectSectionToSubjectsMap).flatMap(
        (section) => subjectSectionToSubjectsMap[section]
      );
  }
};
