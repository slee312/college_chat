class Message
  include Mongoid::Document
  field :user, type: String
  field :content, type: String
  field :creation_date, type: Time
end
