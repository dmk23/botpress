import { DatabaseHelpers } from 'botpress'

let knex = null

function initialize() {
  if (!knex) {
    throw new Error('you must initialize the database before')
  }

  return DatabaseHelpers(knex)
    .createTableIfNotExists('messenger_attachments', function(table) {
      table.string('url').primary()
      table.string('pageId').index()
      table.string('attachment_id')
    })
    .then()
}

function addAttachment(url, attachment_id, pageId) {
  return knex('messenger_attachments')
    .insert({ url, attachment_id, pageId })
    .then()
    .get(0)
}

function getAttachment(url, pageId) {
  return knex('messenger_attachments')
    .where({ url, pageId })
    .select('attachment_id')
    .then()
    .get(0)
    .then(ret => {
      return ret && ret.attachment_id
    })
}

function hasAttachment(url, pageId) {
  return knex('messenger_attachments')
    .where({ url, pageId })
    .count('url as count')
    .then(ret => {
      return ret && ret[0] && ret[0].count + '' === '1'
    })
}

module.exports = k => {
  knex = k
  return { initialize, addAttachment, getAttachment, hasAttachment }
}
