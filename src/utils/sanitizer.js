import DOMPurify from 'dompurify';

//function to sanitise input data before it is saved
export function sanitizeInput(input) {
    return DOMPurify.sanitize(input);
}