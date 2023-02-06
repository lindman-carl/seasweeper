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
          cy.get(`#tile-${id}`, { log: false })
            .find("div")
            .should("have.class", "tile-base")
            .should("have.class", "bg-sky-50");
        } else {
          cy.get(`#tile-${id}`, { log: false })
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

    it("game ends when clicking a bomb tile", () => {
      // cant click a mine before the game has started
      // click a tile to start the game
      cy.get("#tile-0").click();

      // click a mine
      cy.get("#tile-40").click();

      // expect the game to end
      cy.get(".gameoverbox-container").should("be.visible");
      cy.get(".gameoverbox-header").contains("Failure achieved");
    });

    it("can place markers with right click", () => {
      // right click a tile
      cy.get("#tile-0").rightclick();

      // expect the tile to have a marker, svg
      cy.get("#tile-0").find("svg");

      // right click a tile with a marker
      cy.get("#tile-0").rightclick();

      // expect the tile to not have a marker, svg
      cy.get("#tile-0").find("svg").should("not.exist");
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

  describe("gamemode carousel", () => {
    it("can toggle the carousel", () => {
      // expect the carousel to be hidden
      cy.get(".carousel-container").should("not.exist");

      // toggle the carousel, expect it to be visible
      cy.get("[data-id=toggle-gamemode-carousel]").click();
      cy.get(".carousel-container").should("be.visible");

      // toggle the carousel again, expect it to be hidden again
      cy.get("[data-id=toggle-gamemode-carousel]").click();
      cy.get(".carousel-container").should("not.exist");
    });

    it("can select a gamemode", () => {
      // toggle the carousel
      // select a gamemode
      cy.get("[data-id=toggle-gamemode-carousel]").click();
      cy.get("#carousel-right-button").click();
      cy.get("#carousel-right-button").click();

      // select Kiddie pool
      cy.get(".carousel-header").contains("Kiddie pool");
      cy.get(".carousel-card").click();

      // expect the carousel to close
      cy.get(".carousel-container").should("not.exist");

      // expect 100 sea tiles
      cy.get(".tile-base.bg-blue-300").should("have.length", 100);

      // toggle the carousel
      // select a gamemode
      cy.get("[data-id=toggle-gamemode-carousel]").click();
      cy.get("#carousel-left-button").click();
      cy.get("#carousel-left-button").click();
      cy.get("#carousel-left-button").click();
      // select Continent
      cy.get(".carousel-header").contains("Continent");
      cy.get(".carousel-card").click();

      // expect the carousel to close
      cy.get(".carousel-container").should("not.exist");

      // expect a mix of sea and land tiles
      cy.get(".tile-base.bg-blue-300").should("have.length.at.least", 100);
      cy.get(".tile-base.bg-green-300").should("have.length.at.least", 50);
    });

    it("can close the carousel by clicking the toggle button", () => {
      // toggle the carousel
      cy.get("[data-id=toggle-gamemode-carousel]").click();
      cy.get(".carousel-container").should("be.visible");

      // close the carousel by clicking the toggle button
      cy.get("[data-id=toggle-gamemode-carousel]").click();
      cy.get(".carousel-container").should("not.exist");
    });

    it("can close the carousel by clicking the close button", () => {
      // toggle the carousel
      cy.get("[data-id=toggle-gamemode-carousel]").click();
      cy.get(".carousel-container").should("be.visible");

      // close the carousel by clicking the close button
      cy.get(".carousel-close-button").click();
      cy.get(".carousel-container").should("not.exist");
    });

    it("can regenerate the board", () => {
      // toggle the carousel
      cy.get("[data-id=toggle-gamemode-carousel]").click();
      cy.get(".carousel-container").should("be.visible");

      // navigate to islands
      cy.get("#carousel-right-button").click();
      cy.get(".carousel-header").contains("Islands");

      // compare the number of sea tiles in the old board and the new board
      // most of the time, the number of sea tiles should be different
      cy.get(".tile-carousel-base.bg-blue-300").then(($tiles) => {
        // regenerate the board,
        // expect the tiles to be different from the old tiles
        cy.get("#carousel-regenerate-button").click();
        cy.get(".tile-carousel-base.bg-blue-300").should(
          "have.length.not.equal",
          $tiles.length
        );
      });
    });

    it("can't interact with the board when the carousel is open", () => {
      // toggle the carousel
      cy.get("[data-id=toggle-gamemode-carousel]").click();
      cy.get(".carousel-container").should("be.visible");

      // click a tile
      cy.get("#tile-0").find(".tile-clickable").click();
      // expect the tile to not be revealed
      cy.get("#tile-0").find(".tile-base").should("have.class", "bg-blue-300");
    });
  });

  describe("playing the game", () => {
    it("can win the game", () => {
      const tilesToClick = [
        0, 80, 64, 8, 12, 159, 396, 386, 267, 220, 82, 4, 5, 50, 49, 69, 68, 88,
        128, 148, 147, 168, 169, 188, 209, 295, 294, 293, 313, 314, 312, 311,
        291, 134, 114, 115, 94, 93, 74, 75, 17, 15, 327, 328, 349, 389, 242,
        243, 202,
      ];

      // click all the tiles
      for (const id of tilesToClick) {
        cy.get(`#tile-${id}`).click();
      }

      // expect the game to end
      cy.get(".gameoverbox-container").should("be.visible");
      // check the header contains any number cypress
      cy.get(".gameoverbox-header").contains(/\d+/s);
    });
  });
});
