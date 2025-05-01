import { FormSubmission } from "@shared/schema";

export function generateSqlQuery(formData: FormSubmission | null): string {
  if (!formData) {
    return `-- No form data available`;
  }

  let query = `-- SQL query based on your responses
SELECT 
  users.name,
  users.user_group,
  responses.question1,
  responses.question1b,
  responses.question2,
  responses.question2b,
  responses.question3,
  responses.question3b,
  responses.question4,
  responses.question4b,
  responses.question5,
  responses.question5b
FROM users
JOIN responses ON users.id = responses.user_id
WHERE users.user_group = '${formData.userGroup || 'designers'}'`;

  // Add conditions based on responses
  if (formData.question1 === "B") {
    query += `\n  AND responses.question1 = 'B'`;
    
    if (formData.question1b) {
      query += `\n  AND responses.question1b = '${formData.question1b}'`;
    }
  }

  if (formData.question2 === "B") {
    query += `\n  AND responses.question2 = 'B'`;
    
    if (formData.question2b) {
      query += `\n  AND responses.question2b = '${formData.question2b}'`;
    }
  }

  if (formData.question3 === "B") {
    query += `\n  AND responses.question3 = 'B'`;
    
    if (formData.question3b) {
      query += `\n  AND responses.question3b = '${formData.question3b}'`;
    }
  }

  if (formData.question4 === "B") {
    query += `\n  AND responses.question4 = 'B'`;
    
    if (formData.question4b) {
      query += `\n  AND responses.question4b = '${formData.question4b}'`;
    }
  }

  if (formData.question5 === "B") {
    query += `\n  AND responses.question5 = 'B'`;
    
    if (formData.question5b) {
      query += `\n  AND responses.question5b = '${formData.question5b}'`;
    }
  }

  query += `\nORDER BY users.name ASC;`;

  return query;
}
