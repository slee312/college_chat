class Message
  include Mongoid::Document
  include Mongoid::Timestamps

  validates :user, presence: true
  validates :content, presence: true

  field :user, type: String
  field :content, type: String

  embedded_in :room
end
