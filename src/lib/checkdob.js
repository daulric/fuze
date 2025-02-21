function isOver18(birthDate) {
    const dob = new Date(birthDate); // Convert birth date string to Date object
    const today = new Date(); // Get current date

    let age = today.getFullYear() - dob.getFullYear(); // Calculate age
    
    // Adjust age if birthday hasn't occurred this year
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    return age >= 18;
}

export default isOver18;