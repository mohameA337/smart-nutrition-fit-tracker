import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
        // Assuming there is some text that always appears, or just checking it doesn't throw
        const linkElement = document.querySelector('body');
        expect(linkElement).toBeInTheDocument();
    });
});
