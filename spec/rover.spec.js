const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
    it("constructor sets position and default values for mode and generatorWatts", function() {
      const position = 98382;
      const rover = new Rover(position);

      expect(rover.position).toBe(position);
      expect(rover.mode).toBe('NORMAL');
      expect(rover.generatorWatts).toBe(110);
    });

});

it("response returned by receiveMessage contains the name of the message", function() {
  let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
  let message = new Message('TA power', commands);
  let rover = new Rover(98382);

  let response = rover.receiveMessage(message);

  expect(response.message).toEqual('TA power');
});

it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
  let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
  let message = new Message('Test message with two commands', commands);
  let rover = new Rover(98382);

  let response = rover.receiveMessage(message);

  expect(response.results.length).toBe(2);
});

it("responds correctly to the status check command", function() {
  let rover = new Rover(98382);

  let message = new Message('Status Check', [new Command('STATUS_CHECK')]);
  let response = rover.receiveMessage(message);

  expect(response.results[0].completed).toBe(true);
  expect(response.results[0].roverStatus.mode).toBe('NORMAL');
  expect(response.results[0].roverStatus.generatorWatts).toBe(110);
  expect(response.results[0].roverStatus.position).toBe(98382);

});

it("responds correctly to the mode change command", function() {
  let rover = new Rover(98382);

  let message = new Message('Mode Change', [new Command('MODE_CHANGE', 'LOW_POWER')]);
  let response = rover.receiveMessage(message);

  expect(response.results[0].completed).toBe(true);
  expect(rover.mode).toBe('LOW_POWER');
});

it("responds with a false completed value when attempting to move in LOW_POWER mode", function() {
  let rover = new Rover(98382);
  rover.mode = 'LOW_POWER';
  let message = new Message('Move Command', [new Command('MOVE', 4321)]);
  let response = rover.receiveMessage(message);

  expect(response.results[0].completed).toBe(false);
  expect(rover.position).toBe(98382); 
});

it("responds with the position for the move command", function() {
  let rover = new Rover(98382);
  let message = new Message('Move Command', [new Command('MOVE', 3579)]);
  let response = rover.receiveMessage(message);

  expect(response.results[0].completed).toBe(true);
  expect(rover.position).toBe(3579);
});
