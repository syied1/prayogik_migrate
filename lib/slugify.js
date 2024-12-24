/* eslint-disable react-hooks/rules-of-hooks */
// @ts-nocheck

/**
 * Utility function to convert a title to a slug
 * @param {string} title - The title to convert to a slug
 * @returns {string} - The generated slug
 */
// function generateSlug(title) {
//   return title
//     .toLowerCase()
//     .replace(/[^\w\s-]/g, "") // Allow word characters (including Unicode) and remove special characters
//     .trim()
//     .replace(/\s+/g, "-"); // Replace spaces with hyphens
// }

function generateSlug(title) {
  return title
    .toLowerCase() // Convert to lower case
    .trim() // Remove leading and trailing spaces
    .replace(/[^a-z0-9\u0980-\u09FF]+/g, "-") // Remove special characters (allowing Unicode)
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-|-$/g, ""); // Remove leading and trailing hyphens
}

/**
 * Function to check if the slug (or any field) already exists in the database for a given model
 * @param {object} modelInstance - The Prisma model instance
 * @param {string} field - The field to check
 * @param {string} value - The slug value to check
 * @returns {boolean} - Returns true if the field value exists, false if not
 */
async function isSlugTaken(modelInstance, field, value) {
  const record = await modelInstance.findUnique({
    where: { [field]: value },
  });
  return !!record; // Returns true if the field value exists, false if not
}

/**
 * Main function to generate a unique slug for a single model
 * @param {string} title - The title to slugify
 * @param {object} modelInstance - The Prisma model instance
 * @param {string} field - The field to check for uniqueness
 * @returns {string} - The unique slug
 */
export async function slugify(title, modelInstance, field) {
  let slug = generateSlug(title); // Convert title to slug
  let slugExists = await isSlugTaken(modelInstance, field, slug); // Check if slug exists
  let count = 1;

  // Loop to generate a unique slug by appending numbers if necessary
  while (slugExists) {
    const newSlug = `${slug}-${count}`;
    slugExists = await isSlugTaken(modelInstance, field, newSlug);
    if (!slugExists) {
      slug = newSlug;
    }
    count++;
  }

  return slug; // Return the unique slug
}

/**
 * Function to check if the slug (or any field) already exists in the database for a composite model
 * @param {object} modelInstance - The Prisma model instance
 * @param {string} slugField - The field for the slug
 * @param {string} slugValue - The slug value to check
 * @param {string} compositeField - The other field for composite uniqueness
 * @param {string} compositeValue - The value of the other field
 * @returns {boolean} - Returns true if the composite slug value exists, false if not
 */
async function isCompositeSlugTaken(
  modelInstance,
  slugField,
  slugValue,
  compositeField,
  compositeValue
) {
  const record = await modelInstance.findUnique({
    where: {
      [slugField]: slugValue,
      [compositeField]: compositeValue,
    },
  });
  return !!record; // Returns true if the composite field value exists, false if not
}

/**
 * Main function to generate a unique slug for a composite model
 * @param {string} title - The title to slugify
 * @param {object} modelInstance - The Prisma model instance
 * @param {string} slugField - The field for the slug
 * @param {string} compositeField - The other field for composite uniqueness
 * @param {string} compositeValue - The value of the other field
 * @returns {string} - The unique slug
 */
export async function compositeSlugify(
  title,
  modelInstance,
  slugField,
  compositeField,
  compositeValue
) {
  let slug = generateSlug(title); // Convert title to slug
  let slugExists = await isCompositeSlugTaken(
    modelInstance,
    slugField,
    slug,
    compositeField,
    compositeValue
  ); // Check if slug exists
  let count = 1;

  // Loop to generate a unique slug by appending numbers if necessary
  while (slugExists) {
    const newSlug = `${slug}-${count}`;
    slugExists = await isCompositeSlugTaken(
      modelInstance,
      slugField,
      newSlug,
      compositeField,
      compositeValue
    );
    if (!slugExists) {
      slug = newSlug;
    }
    count++;
  }

  return slug; // Return the unique slug
}
