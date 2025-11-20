export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Rwanda phone format: +250 XXX XXX XXX or 07XX XXX XXX
  const regex = /^(\+?250|0)?[7][0-9]{8}$/;
  return regex.test(phone.replace(/\s/g, ""));
}

export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPEG, PNG, or WebP images.",
    };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "File size exceeds 10MB limit." };
  }

  return { valid: true };
}

export function validateQuantity(quantity: string): boolean {
  const regex = /^\d+(\.\d+)?\s*(kg|g|ton|tonnes|bags?|sacks?)$/i;
  return regex.test(quantity.trim());
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .slice(0, 1000); // Limit length
}
