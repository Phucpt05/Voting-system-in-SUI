import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock networkConfig
jest.mock('../config/networkConfig', () => ({
  useNetworkVariable: jest.fn(() => '0x123'),
  createNetworkConfig: jest.fn(),
}));

// Mock the navigation context
jest.mock('../providers/theme/navigation/NavigationContext', () => ({
  useNavigation: () => ({
    currentPage: '/',
  }),
}));

// Mock the components
jest.mock('../components/Navbar', () => ({
  __esModule: true,
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

jest.mock('../views/ProposalView', () => ({
  __esModule: true,
  default: () => <div data-testid="proposal-view">Proposal View</div>,
}));

describe('App Component', () => {
  it('should render App component without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('should render ProposalView when currentPage is "/"', () => {
    render(<App />);
    expect(screen.getByTestId('proposal-view')).toBeInTheDocument();
  });

  it('should render footer with copyright text', () => {
    render(<App />);
    expect(screen.getByText(/2025 Voting DApp/i)).toBeInTheDocument();
  });
});

