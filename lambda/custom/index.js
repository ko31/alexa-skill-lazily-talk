const Alexa = require('ask-sdk-core');

const SKILL_NAME = "テキトーク";
const FALLBACK_MESSAGE = "";
const FALLBACK_REPROMPT = "";
const HELP_MESSAGE = "テキトークは会話ができるスキルです。気軽に何か話しかけてみてください。テキトークをやめる時は「終わる」と言ってくださいね。";
const REPROMPT_MESSAGE = "何か話しかけてみてください。";
const ERROR_MESSAGE = "ごめんなさい。わかりませんでした";
const STOP_MESSAGE = '<say-as interpret-as="interjection">またいつでもどうぞ</say-as>';

const comments = require('./comments');

function convertSound(message) {
    message = '<voice name="Matthew"><lang xml:lang="ja-JP">' + message + '</lang></voice>';
    return message;
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(HELP_MESSAGE)
        .reprompt(REPROMPT_MESSAGE)
        .getResponse();
    },
};
  
const GetTalkHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'LaunchRequest'
        || (request.type === 'IntentRequest'
          && request.intent.name === 'GetTalkIntent');
    },
    handle(handlerInput) {
      let message = comments.value[Math.floor(Math.random() * comments.value.length)];
      message = convertSound(message);
      return handlerInput.responseBuilder
        .speak(message)
        .reprompt(message)
        .getResponse();
    },
  };
  
const HelpHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(HELP_MESSAGE)
        .reprompt(REPROMPT_MESSAGE)
        .getResponse();
    },
};
  
const FallbackHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(FALLBACK_MESSAGE)
      .reprompt(FALLBACK_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(ERROR_MESSAGE)
      .reprompt(ERROR_MESSAGE)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    GetTalkHandler,
    HelpHandler,
    ExitHandler,
    FallbackHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
