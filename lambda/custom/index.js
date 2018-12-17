const Alexa = require('ask-sdk-core');

const SKILL_NAME = "テキトーク";
const HELP_MESSAGE = 'テキトークはあなたとテキトーな会話をしてくれます。何でも気軽に話しかけてみてください。<break time="0.2s"/>テキトークをやめる時は「終わる」と言ってくださいね。';
const REPROMPT_MESSAGE = "何か話しかけてみてください。";
const ERROR_MESSAGE = "ごめんなさい。わかりませんでした";
const STOP_MESSAGE = '<say-as interpret-as="interjection">またいつでもどうぞ</say-as>';
const FALLBACK_MESSAGE = "";
const FALLBACK_REPROMPT = "";

const reactions = require('./reactions');
const comments = require('./comments');

function convertSound(message) {
    message = '<voice name="Mizuki"><lang xml:lang="ja-JP">' + message + '</lang></voice>';
    return message;
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
      const smallImageUrl = 'https://s3-ap-northeast-1.amazonaws.com/gosign-alexa-assets/lazily-talk/woman-720x480.png';
      const largeImageUrl = 'https://s3-ap-northeast-1.amazonaws.com/gosign-alexa-assets/lazily-talk/woman-1200x800.png';
      return handlerInput.responseBuilder
        .speak(HELP_MESSAGE)
        .reprompt(REPROMPT_MESSAGE)
        .withStandardCard(SKILL_NAME, REPROMPT_MESSAGE, smallImageUrl, largeImageUrl)
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
      let reaction = reactions.value[Math.floor(Math.random() * reactions.value.length)];
      let comment = comments.value[Math.floor(Math.random() * comments.value.length)];
      let message = reaction + '<break time="0.2s"/>' + comment;
//      message = convertSound(message);
      return handlerInput.responseBuilder
        .speak(message)
        .reprompt(REPROMPT_MESSAGE)
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
