class Room
  include Mongoid::Document
  include Mongoid::Timestamps

  validates :name, presence: true
  validates :name, uniqueness: true

  field :name, type: String
  field :location, type: Array

  index(
    {location: "2d"},
    {background: true}
  )

  embeds_many :messages
end
