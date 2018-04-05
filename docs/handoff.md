# Handoff to Human

Regardless of how much artificial intelligence a bot possesses, there may still be times when it needs to hand off the conversation to a human being. For example you want to build a bot that automatically replies some questions and is able to meet your customers wherever they are, but still be able to escalate issues to a human. Or if the bot couldn't handle every situation, or there were edge cases, the bot should be able to pass off to a person who had the right authority. The bot should recognize when it needs to hand off and provide the user with a clear, smooth transition. In this exercise, you will learn how you can use a bot to initiate a conversation with a user, and then hand off context to a human agent.

Inspiration for this handoff method comes from Microsoft's [Mission Mars Excercise](https://github.com/MissionMarsFourthHorizon/operation-max)

The handoff bot pattern is further explained in [this article](https://docs.microsoft.com/en-us/bot-framework/bot-design-pattern-handoff-human).


Please notice that there are several ways in which you can implement the hand-off logic, this uses an approach similar to the implemented in [this sample](https://github.com/palindromed/Bot-HandOff).

This diagram outlines the components of the bot used in handoff.

![handoff-diagram](https://github.com/MissionMarsFourthHorizon/operation-max/raw/master/Node/images/exercise7-diagram.png)


## Usage

* When the bot receives a command with the text _"/agent login"_, mark that the conversation is from a human agent. After this happens, this user is able to:
* Type _"connect"_ to connect to a human agent. In this state, all the messages that the agent types are forwarded to the user. The same happens the other way around. The bot is transformed in a "message forwarder".
* Type _"help"_ to get the list of commands (optional).
* Type _"resume"_ to disconnect from the user and talk back to the bot.