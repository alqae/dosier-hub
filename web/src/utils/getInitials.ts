export const getInitials = (name?: string): string => {
  // Split the name into individual words
  const words = (name ?? '').split(' ')

  // Initialize an empty string to store the initials
  let initials = ''

  // Loop through each word and add its first letter to the initials string
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > 0) {
      initials += words[i][0].toUpperCase()
    }
  }

  return initials
}
