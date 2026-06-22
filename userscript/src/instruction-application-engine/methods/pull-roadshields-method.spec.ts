import pullRoadshieldsMethod from './pull-roadshields-method';
import { getSegmentByVertex, getStreetBySegment } from '@/utils/location';
import { createTurnGuidance } from '@/utils/wme-entities/turn-guidance';

jest.mock('@/utils/get-wme-window', () => ({
  getWazeMapEditorWindow: jest.fn(() => ({
    W: {
      model: {
        roadGraph: {}
      }
    }
  }))
}));

jest.mock('@/utils/location', () => ({
  getSegmentByVertex: jest.fn(),
  getStreetBySegment: jest.fn()
}));

jest.mock('@/utils/wme-entities/turn-guidance', () => ({
  createTurnGuidance: jest.fn((data) => data)
}));

describe('pullRoadshieldsMethod', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockGetSegmentByVertex = getSegmentByVertex as jest.Mock;
  const mockGetStreetBySegment = getStreetBySegment as jest.Mock;
  const mockCreateTurnGuidance = createTurnGuidance as jest.Mock;

  function createMockTurn(options: {
    hasTurnGuidance: boolean;
    streetName?: string | null;
    signText?: string | null;
    signType?: number;
  }) {
    const mockTurnData = {
      hasTurnGuidance: jest.fn(() => options.hasTurnGuidance),
      withTurnGuidance: jest.fn().mockReturnThis()
    };

    const mockTurn = {
      getTurnData: jest.fn(() => mockTurnData),
      getToVertex: jest.fn(() => ({ getID: () => 'vertex_123' })),
      withTurnData: jest.fn().mockReturnThis()
    };

    const mockSegment = { id: 'segment_123' };
    let mockStreet: any = null;

    if (options.streetName !== undefined || options.signText !== undefined) {
      mockStreet = {
        getName: jest.fn(() => options.streetName),
        getAttribute: jest.fn((attr) => {
          if (attr === 'signText') return options.signText;
          if (attr === 'signType') return options.signType;
          return null;
        })
      };
    }

    return { mockTurn, mockTurnData, mockSegment, mockStreet };
  }

  it('should return turn unmodified if it already has turn guidance', () => {
    const { mockTurn } = createMockTurn({ hasTurnGuidance: true });

    const result = pullRoadshieldsMethod.application([mockTurn as any]);

    expect(result[0]).toBe(mockTurn);
    expect(mockGetSegmentByVertex).not.toHaveBeenCalled();
  });

  it('should return turn unmodified if street is null/undefined (e.g. streetless segment)', () => {
    const { mockTurn, mockSegment } = createMockTurn({
      hasTurnGuidance: false,
      streetName: undefined // resulting in street being mock-returned as null
    });

    mockGetSegmentByVertex.mockReturnValue(mockSegment);
    mockGetStreetBySegment.mockReturnValue(null);

    const result = pullRoadshieldsMethod.application([mockTurn as any]);

    expect(result[0]).toBe(mockTurn);
    expect(mockTurn.withTurnData).not.toHaveBeenCalled();
  });

  it('should return turn unmodified if street has no signText (roadshield text)', () => {
    const { mockTurn, mockSegment, mockStreet } = createMockTurn({
      hasTurnGuidance: false,
      streetName: 'Main St',
      signText: null
    });

    mockGetSegmentByVertex.mockReturnValue(mockSegment);
    mockGetStreetBySegment.mockReturnValue(mockStreet);

    const result = pullRoadshieldsMethod.application([mockTurn as any]);

    expect(result[0]).toBe(mockTurn);
    expect(mockStreet.getAttribute).toHaveBeenCalledWith('signText');
    expect(mockTurn.withTurnData).not.toHaveBeenCalled();
  });

  it('should return turn unmodified if street name is null/undefined', () => {
    const { mockTurn, mockSegment, mockStreet } = createMockTurn({
      hasTurnGuidance: false,
      streetName: null,
      signText: '99'
    });

    mockGetSegmentByVertex.mockReturnValue(mockSegment);
    mockGetStreetBySegment.mockReturnValue(mockStreet);

    const result = pullRoadshieldsMethod.application([mockTurn as any]);

    expect(result[0]).toBe(mockTurn);
    expect(mockStreet.getName).toHaveBeenCalled();
    expect(mockTurn.withTurnData).not.toHaveBeenCalled();
  });

  it('should return turn unmodified if street name does not start with roadshield prefixes', () => {
    const { mockTurn, mockSegment, mockStreet } = createMockTurn({
      hasTurnGuidance: false,
      streetName: 'Main St 99',
      signText: '99'
    });

    mockGetSegmentByVertex.mockReturnValue(mockSegment);
    mockGetStreetBySegment.mockReturnValue(mockStreet);

    const result = pullRoadshieldsMethod.application([mockTurn as any]);

    expect(result[0]).toBe(mockTurn);
    expect(mockTurn.withTurnData).not.toHaveBeenCalled();
  });

  it('should apply turn guidance and trim name when street name starts with roadshield prefix', () => {
    const { mockTurn, mockTurnData, mockSegment, mockStreet } = createMockTurn({
      hasTurnGuidance: false,
      streetName: 'To 99 Eastbound',
      signText: '99',
      signType: 2
    });

    mockGetSegmentByVertex.mockReturnValue(mockSegment);
    mockGetStreetBySegment.mockReturnValue(mockStreet);

    const result = pullRoadshieldsMethod.application([mockTurn as any]);

    expect(mockCreateTurnGuidance).toHaveBeenCalledWith({
      roadShields: {
        'RS-0': {
          type: 2,
          text: '99'
        }
      },
      visualInstruction: '$RS-0 Eastbound',
      tts: '99 Eastbound'
    });

    expect(mockTurnData.withTurnGuidance).toHaveBeenCalled();
    expect(mockTurn.withTurnData).toHaveBeenCalledWith(mockTurnData);
    expect(result[0]).toBe(mockTurn);
  });
});
