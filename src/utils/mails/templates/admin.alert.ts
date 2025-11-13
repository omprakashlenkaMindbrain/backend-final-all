export function adminAlertTemplate(userEmail: string) {
  return {
    subject: "🔔 New User Registered",
    html: `
      <p>A new user just signed up:</p>
      <b>${userEmail}</b>
    `,
  };
}
