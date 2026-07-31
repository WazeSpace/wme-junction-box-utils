import {
  isPathRequiredForTurn,
  checkBigJunctionPathsCompatibility,
  IncompatibleBigJunctionPathConversionError,
} from './convert-big-junction-to-paths';
import { Turn } from '@/@waze/Waze/Model/turn';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';

describe('convert-big-junction-to-paths', () => {
  describe('isPathRequiredForTurn', () => {
    it('returns false if turnData has no lanes, instruction, or guidance', () => {
      const mockTurn = {
        getTurnData: () => ({
          hasLanes: () => false,
          hasInstructionOpcode: () => false,
          hasTurnGuidance: () => false,
        }),
      } as unknown as Turn;

      expect(isPathRequiredForTurn(mockTurn)).toBe(false);
    });

    it('returns true if turnData has lanes', () => {
      const mockTurn = {
        getTurnData: () => ({
          hasLanes: () => true,
          hasInstructionOpcode: () => false,
          hasTurnGuidance: () => false,
        }),
      } as unknown as Turn;

      expect(isPathRequiredForTurn(mockTurn)).toBe(true);
    });

    it('returns true if turnData has instruction opcode', () => {
      const mockTurn = {
        getTurnData: () => ({
          hasLanes: () => false,
          hasInstructionOpcode: () => true,
          hasTurnGuidance: () => false,
        }),
      } as unknown as Turn;

      expect(isPathRequiredForTurn(mockTurn)).toBe(true);
    });

    it('returns true if turnData has turn guidance', () => {
      const mockTurn = {
        getTurnData: () => ({
          hasLanes: () => false,
          hasInstructionOpcode: () => false,
          hasTurnGuidance: () => true,
        }),
      } as unknown as Turn;

      expect(isPathRequiredForTurn(mockTurn)).toBe(true);
    });
  });

  describe('checkBigJunctionPathsCompatibility', () => {
    beforeEach(() => {
      (window as any).require = (mod: string) => {
        switch (mod) {
          case 'Waze/Model/Graph/Vertex':
            return class Vertex {
              constructor(
                public segmentId: number,
                public direction: string,
              ) {}
            };
          default:
            throw new Error(`Unexpected module requested: ${mod}`);
        }
      };
      (window as any).W = {
        model: {
          segments: {
            getObjectById: (id: number) =>
              ({
                getAttribute: (attr: string) =>
                  attr === 'toCrossroads' ? [1] : id,
              }) as any,
            getByIds: (ids: number[]) =>
              ids.map(
                (id) =>
                  ({
                    getAttribute: (attr: string) =>
                      attr === 'toCrossroads' ? [1] : id,
                  }) as any,
              ),
          },
          turnGraph: {
            getTurn: () => null,
            getAllTurns: () => [],
          },
        },
      };
    });

    it('returns isCompatible true when no turns are present', () => {
      const mockBigJunction = {
        getShortestTurns: () => [],
        getTurnsFrom: () => [],
        getAttribute: () => 1,
      } as unknown as BigJunctionDataModel;

      const mockDataModel = (window as any).W.model;

      const result = checkBigJunctionPathsCompatibility(
        mockBigJunction,
        mockDataModel,
      );
      expect(result.isCompatible).toBe(true);
      expect(result.incompatibleTurns).toHaveLength(0);
    });

    it('returns UNLOADED_DATA reason type when a segment in segmentPath is missing', () => {
      const mockFarTurn = {
        getID: () => '100f200t',
        fromVertex: { getSegmentID: () => 100 },
        toVertex: { getSegmentID: () => 200 },
        getFromVertex: function () {
          return this.fromVertex;
        },
        getToVertex: function () {
          return this.toVertex;
        },
        getTurnData: () => ({
          getSegmentPath: () => [100, 999, 200],
          isAllowed: () => true,
          getRestrictions: () => [],
        }),
      };

      const mockBigJunction = {
        getShortestTurns: () => [mockFarTurn],
        getTurnsFrom: () => [mockFarTurn],
        getEntranceSegments: () => [],
        getAttribute: () => 1,
      } as unknown as BigJunctionDataModel;

      const mockDataModel = {
        segments: {
          getObjectById: (id: number) =>
            id === 999
              ? null
              : ({
                  getAttribute: (attr: string) =>
                    attr === 'toCrossroads' ? [1] : id,
                } as any),
          getByIds: (ids: number[]) =>
            ids.map(
              (id) =>
                ({
                  getAttribute: (attr: string) =>
                    attr === 'toCrossroads' ? [1] : id,
                }) as any,
            ),
        },
        getTurnGraph: () => ({ getTurn: () => null, getAllTurns: () => [] }),
      };

      const result = checkBigJunctionPathsCompatibility(
        mockBigJunction,
        mockDataModel,
      );
      expect(result.isCompatible).toBe(false);
      expect(result.incompatibleTurns).toHaveLength(1);
      expect(result.incompatibleTurns[0].reasonType).toBe('UNLOADED_DATA');
      expect(result.incompatibleTurns[0].incompatibleEntities).toEqual([
        { type: 'segment', id: 999 },
      ]);
    });

    it('returns isCompatible true for a disallowed far turn when the immediate path is also disallowed overall', () => {
      const mockFarTurn = {
        getID: () => '100f200t',
        fromVertex: { getSegmentID: () => 100 },
        toVertex: { getSegmentID: () => 200 },
        getFromVertex: function () {
          return this.fromVertex;
        },
        getToVertex: function () {
          return this.toVertex;
        },
        getTurnData: () => ({
          getSegmentPath: () => [100, 150, 200],
          isAllowed: () => false, // Disallowed far turn
          getRestrictions: () => [],
        }),
      };

      const mockBigJunction = {
        getShortestTurns: () => [mockFarTurn],
        getTurnsFrom: () => [mockFarTurn],
        getEntranceSegments: () => [],
        getAttribute: () => 1,
      } as unknown as BigJunctionDataModel;

      const mockDataModel = {
        segments: {
          getObjectById: (id: number) =>
            ({
              getAttribute: (attr: string) =>
                attr === 'toCrossroads'
                  ? [1]
                  : attr === 'fromNodeID'
                    ? 10
                    : attr === 'toNodeID'
                      ? 20
                      : id,
            }) as any,
          getByIds: (ids: number[]) =>
            ids.map(
              (id) =>
                ({
                  getAttribute: (attr: string) =>
                    attr === 'toCrossroads'
                      ? [1]
                      : attr === 'fromNodeID'
                        ? 10
                        : attr === 'toNodeID'
                          ? 20
                          : id,
                }) as any,
            ),
        },
        getTurnGraph: () => ({
          // First immediate turn (100 -> 150) is allowed, but second immediate turn (150 -> 200) is disallowed
          getTurn: (fromV: any) =>
            fromV.segmentId === 100
              ? ({
                  getTurnData: () => ({
                    isAllowed: () => true,
                    getRestrictions: () => [],
                  }),
                  getID: () => '100t',
                } as any)
              : ({
                  getTurnData: () => ({
                    isAllowed: () => false,
                    getRestrictions: () => [],
                  }),
                  getID: () => '150t',
                } as any),
          getAllTurns: () => [],
        }),
      };

      const result = checkBigJunctionPathsCompatibility(
        mockBigJunction,
        mockDataModel,
      );
      // Since immediate turn 150 -> 200 is disallowed, effective path is disallowed, matching the disallowed far turn!
      expect(result.isCompatible).toBe(true);
      expect(result.incompatibleTurns).toHaveLength(0);
    });
  });

  describe('IncompatibleBigJunctionPathConversionError', () => {
    it('creates custom error with incompatibleTurns property', () => {
      const details = [
        {
          turnId: '1f2t',
          fromSegmentId: 1,
          toSegmentId: 2,
          reasonType: 'UNLOADED_DATA' as const,
          details: 'Data missing',
        },
      ];
      const error = new IncompatibleBigJunctionPathConversionError(details);
      expect(error.name).toBe('IncompatibleBigJunctionPathConversionError');
      expect(error.incompatibleTurns).toEqual(details);
      expect(error.message).toContain(
        'Junction Box contains incompatible turns',
      );
    });
  });
});
