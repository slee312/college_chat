class Room
  include Mongoid::Document
  field :name, type: String
  field :location, type: Array

  index(
    {location: "2d"},
    {background: true}
  )

  embeds_many :messages
end
