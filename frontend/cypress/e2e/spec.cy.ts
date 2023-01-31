import { Board } from "../../src/types";
import { getRandomIndices } from "./testUtils";

// test board
import testData from "../../src/utils/test-board.json";
const testBoard = testData as Board;

describe("The game", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });
  it("successfully loads the test board", () => {
    // check some random tiles to see if it match the test board
    const randomIndices = getRandomIndices(40, testBoard.tiles);
    for (const idx of randomIndices) {
      const tile = testBoard.tiles[idx];
      const expectedClass = tile.type === 1 ? "bg-green-300" : "bg-blue-300";
      cy.get(`#tile-${idx}`)
        .find("div")
        .should("have.class", "tile-base")
        .should("have.class", expectedClass);
    }
  });

  describe("clicking tile", () => {
    it("reveals the correct tiles", () => {
      cy.get("#tile-0").find(".tile-clickable").click();
      // expect the correct tiles to be revealed
      const expectedRevealed = {
        0: true,
        1: true,
        2: true,
        3: true,
        20: true,
        21: true,
        22: true,
        23: true,
        41: true,
        42: true,
        43: true,
      };
      for (const { id } of testBoard.tiles) {
        // just check the first 5 rows
        if (id > 100) {
          break;
        }

        // a tile is revealed if it has the revealed background color: bg-sky-50
        if (expectedRevealed.hasOwnProperty(id)) {
          cy.get(`#tile-${id}`)
            .find("div")
            .should("have.class", "tile-base")
            .should("have.class", "bg-sky-50");
        } else {
          cy.get(`#tile-${id}`)
            .find("div")
            .should("have.class", "tile-base")
            .should("not.have.class", "bg-sky-50");
        }
      }
    });

    it("nothing happens when clicking a land tile", () => {
      cy.get("#tile-70").click();

      // expect the tile to have the default background color: bg-green-300
      cy.get("#tile-70")
        .find("div")
        .should("have.class", "tile-base")
        .should("have.class", "bg-green-300");
    });

    it("nothing happens when clicking a revealed tile", () => {
      cy.get("#tile-0").click();
      cy.get("#tile-0").click();

      // expect the tile to have the revealed background color: bg-sky-50
      cy.get("#tile-0")
        .find("div")
        .should("have.class", "tile-base")
        .should("have.class", "bg-sky-50");
    });

    it("nothing happens when clicking a marked tile", () => {
      cy.get("[data-id=toggle-mark-mode]").click();
      cy.get("#tile-0").click();

      // expect the tile to have a marker, svg
      cy.get("#tile-0").find("svg");

      cy.get("[data-id=toggle-mark-mode]").click();
      cy.get("#tile-0").click();

      // expect the tile to still have a marker, svg
      cy.get("#tile-0").find("svg");
    });
  });

  describe("placing lighthouse", () => {
    it("can place a lighthouse", () => {
      // expect 2 lighthouses left
      cy.get("[data-id=toggle-lighthouse-mode]").contains("2");

      // toggle lighthouse mode, click a tile
      cy.get("[data-id=toggle-lighthouse-mode]").click();
      cy.get("#tile-72").click();

      // expect 1 lighthouse left
      cy.get("[data-id=toggle-lighthouse-mode]").contains("1");

      // expect the tile to have a lighthouse, check for svg
      cy.get("#tile-72").find("svg");

      // check that the correct tiles are lit, and the rest are not
      // 5x5 grid centered at 72
      const litTiles = [51, 52, 53, 73, 93];
      for (const id of litTiles) {
        // expect the lit tiles to have the lit background color: bg-yellow-100
        cy.get(`#tile-${id}`)
          .find("div")
          .should("have.class", "tile-base")
          .should("have.class", "bg-yellow-100");
      }
      const unlitTiles = [
        30, 31, 32, 33, 34, 50, 54, 70, 71, 72, 74, 90, 91, 92, 94,
      ];
      for (const id of unlitTiles) {
        // expect the unlit tiles to not have the lit background color: bg-yellow-100
        cy.get(`#tile-${id}`)
          .find("div")
          .should("have.class", "tile-base")
          .should("not.have.class", "bg-yellow-100");
      }
    });
    it("can place 2 lighthouses", () => {
      // expect 2 lighthouses left
      cy.get("[data-id=toggle-lighthouse-mode]").contains("2");

      // toggle lighthouse mode, click a tile
      cy.get("[data-id=toggle-lighthouse-mode]").click();
      cy.get("#tile-72").click();

      // expect 1 lighthouse left
      cy.get("[data-id=toggle-lighthouse-mode]").contains("1");

      // expect the tile to have a lighthouse, check for svg
      cy.get("#tile-72").find("svg");

      // place another lighthouse
      cy.get("#tile-265").click();

      // expect 0 lighthouses left
      cy.get("[data-id=toggle-lighthouse-mode]").contains("-");

      // expect the tile to have a lighthouse, check for svg
      cy.get("#tile-265").find("svg");
    });

    it("can't place more than 2 lighthouses", () => {
      // toggle lighthouse mode, try place 3 lighthouses
      cy.get("[data-id=toggle-lighthouse-mode]").click();
      cy.get("#tile-72").click();
      cy.get("#tile-265").click();
      cy.get("#tile-93").click();

      // expect 0 lighthouses left
      cy.get("[data-id=toggle-lighthouse-mode]").contains("-");

      // check for 3 lighthouses, expect 2
      cy.get("#tile-72").find("svg");
      cy.get("#tile-265").find("svg");
      cy.get("#tile-93").find("svg").should("not.exist");
    });

    it("placing on a sea tile reveals it", () => {
      // expect 2 lighthouses left
      cy.get("[data-id=toggle-lighthouse-mode]").contains("2");

      // toggle lighthouse mode, click a sea tile
      cy.get("[data-id=toggle-lighthouse-mode]").click();
      cy.get("#tile-0").click();

      // expect the tile to have the revealed background color: bg-sky-50
      cy.get("#tile-0")
        .find("div")
        .should("have.class", "tile-base")
        .should("have.class", "bg-sky-50");

      // expect to still have 2 lighthouses left
      cy.get("[data-id=toggle-lighthouse-mode]").contains("2");
    });
  });
});
